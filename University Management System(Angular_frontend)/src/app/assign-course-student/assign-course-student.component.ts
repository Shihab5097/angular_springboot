import { Component, OnInit } from '@angular/core';
import { Department } from '../model/department.model';
import { AcademicProgram } from '../model/academicProgram.model';
import { Batch } from '../model/batch.model';
import { Semester } from '../model/semester.model';
import { Course } from '../model/course.model';
import { Student } from '../model/student.model';
import { DepartmentService } from '../service/department.service';
import { AcademicProgramService } from '../service/academicProgram.service';
import { BatchService } from '../service/batch.service';
import { SemesterService } from '../service/semester.service';
import { CourseService } from '../service/course.service';
import { StudentService } from '../service/student.service';
import { AssignCourseStudentService } from '../service/assign-course-student.service';
import { StudentCourseAssignment } from '../model/student-course-assignment';
import { AssignmentRequest } from '../model/assignment-request';

@Component({
  selector: 'app-assign-course-student',
  templateUrl: './assign-course-student.component.html',
  styleUrls: ['./assign-course-student.component.css']
})
export class AssignCourseStudentComponent implements OnInit {
  departments: Department[] = [];
  programs: AcademicProgram[] = [];
  batches: Batch[] = [];
  semesters: Semester[] = [];
  courses: Course[] = [];
  students: Student[] = [];
  assignedStudents: StudentCourseAssignment[] = [];

  filteredPrograms: AcademicProgram[] = [];
  filteredBatches: Batch[] = [];
  filteredSemesters: Semester[] = [];
  filteredStudents: Student[] = [];

  selectedDeptId: number | null = null;
  selectedProgId: number | null = null;
  selectedBatchId: number | null = null;
  selectedSemId: number | null = null;
  selectedCourseId: number | null = null;
  selectedStudentIds: number[] = [];

  constructor(
    private deptSvc: DepartmentService,
    private progSvc: AcademicProgramService,
    private batchSvc: BatchService,
    private semSvc: SemesterService,
    private courseSvc: CourseService,
    private studentSvc: StudentService,
    private assignSvc: AssignCourseStudentService
  ) {}

  ngOnInit(): void {
    this.deptSvc.getAll().subscribe(d => this.departments = d);
    this.progSvc.getAll().subscribe(p => this.programs = p);
    this.batchSvc.getAllBatches().subscribe(b => this.batches = b);
    this.semSvc.getAll().subscribe(s => this.semesters = s);
    this.courseSvc.getAllCourses().subscribe(c => this.courses = c);
    this.studentSvc.getAll().subscribe(st => this.students = st);
  }

  onDeptChange(): void {
    this.filteredPrograms = this.selectedDeptId 
      ? this.programs.filter(p => p.department.departmentId === this.selectedDeptId) 
      : [];
    this.filteredSemesters = this.selectedDeptId 
      ? this.semesters.filter(s => s.department.departmentId === this.selectedDeptId)
      : [];
    this.selectedProgId = this.selectedBatchId = this.selectedSemId = null;
    this.filteredBatches = this.filteredStudents = [];
    this.assignedStudents = [];
  }

  onProgChange(): void {
    this.filteredBatches = this.selectedProgId 
      ? this.batches.filter(b => b.academicProgram.programId === this.selectedProgId)
      : [];
    this.filteredSemesters = this.filteredSemesters
      .filter(s => s.academicProgram.programId === this.selectedProgId);
    this.selectedBatchId = this.selectedSemId = null;
    this.filteredStudents = [];
    this.assignedStudents = [];
  }

  onBatchChange(): void {
    this.selectedSemId = null;
    this.filteredStudents = this.selectedBatchId 
      ? this.students.filter(st => st.batch.batchId === this.selectedBatchId)
      : [];
    this.assignedStudents = [];
  }

  onSemChange(): void {
    this.filteredStudents = this.selectedSemId 
      ? this.students.filter(st => st.semester.semesterId === this.selectedSemId)
      : [];
    this.selectedStudentIds = [];
    this.assignedStudents = [];
  }

  onCourseChange(): void {
    if (this.selectedCourseId) {
      this.assignSvc.getByCourse(this.selectedCourseId)
        .subscribe(list => this.assignedStudents = list);
    } else {
      this.assignedStudents = [];
    }
    this.selectedStudentIds = [];
  }

  toggleStudent(id: number, ev: any): void {
    if (ev.target.checked) {
      this.selectedStudentIds.push(id);
    } else {
      this.selectedStudentIds = this.selectedStudentIds.filter(x => x !== id);
    }
  }

  assign(): void {
    if (!this.selectedCourseId || this.selectedStudentIds.length === 0) {
      alert('প্রথমে কোর্স ও স্টুডেন্ট সিলেক্ট করুন');
      return;
    }
    const req: AssignmentRequest = {
      courseId: this.selectedCourseId,
      studentIds: this.selectedStudentIds
    };
    this.assignSvc.assign(req).subscribe(() => {
      alert('স্টুডেন্টগণ সফলভাবে অ্যাসাইন হয়েছে');
      this.onCourseChange();  // লিস্ট রিশ্রো করবে
    });
  }

  remove(courseId: number, studentId: number): void {
    if (!confirm('টাকা নিশ্চয় স্টুডেন্ট রিমুভ করবেন?')) return;
    this.assignSvc.removeStudent(courseId, studentId)
      .subscribe(() => this.onCourseChange());
  }
}
