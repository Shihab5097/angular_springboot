import { Component, OnInit } from '@angular/core';
import { Student } from '../model/student.model';
import { Department } from '../model/department.model';
import { AcademicProgram } from '../model/academicProgram.model';
import { Batch } from '../model/batch.model';
import { Semester } from '../model/semester.model';
import { StudentService } from '../service/student.service';
import { DepartmentService } from '../service/department.service';
import { AcademicProgramService } from '../service/academicProgram.service';
import { BatchService } from '../service/batch.service';
import { SemesterService } from '../service/semester.service';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.css']
})
export class StudentManagementComponent implements OnInit {
  students: Student[] = [];
  departments: Department[] = [];
  programs: AcademicProgram[] = [];
  batches: Batch[] = [];
  semesters: Semester[] = [];

  filteredPrograms: AcademicProgram[] = [];
  filteredBatches: Batch[] = [];
  filteredSemesters: Semester[] = [];

  studentForm: Student = {
    studentName: '',
    studentEmail: '',
    studentContact: '',
    status: 'Active',
    department: { departmentId: 0 },
    academicProgram: { programId: 0 },
    batch: { batchId: 0 },
    semester: { semesterId: 0 }
  };

  constructor(
    private studentSvc: StudentService,
    private deptSvc: DepartmentService,
    private progSvc: AcademicProgramService,
    private batchSvc: BatchService,
    private semSvc: SemesterService
  ) {}

  ngOnInit(): void {
    this.loadAllLookups();
    this.loadStudents();
  }

  private loadAllLookups(): void {
    this.deptSvc.getAll().subscribe(d => this.departments = d);
    this.progSvc.getAll().subscribe(p => this.programs = p);
    this.batchSvc.getAllBatches().subscribe(b => this.batches = b);
    this.semSvc.getAll().subscribe(s => this.semesters = s);
  }

  private loadStudents(): void {
    this.studentSvc.getAll().subscribe(s => this.students = s);
  }

  onDepartmentChange(): void {
    const deptId = this.studentForm.department.departmentId;
    this.filteredPrograms = this.programs.filter(p => p.department.departmentId === deptId);
    this.filteredBatches = [];
    this.filteredSemesters = [];
    this.studentForm.academicProgram = { programId: 0 };
    this.studentForm.batch = { batchId: 0 };
    this.studentForm.semester = { semesterId: 0 };
  }

  onProgramChange(): void {
    const progId = this.studentForm.academicProgram.programId;
    this.filteredBatches = this.batches.filter(b => b.academicProgram.programId === progId);
    this.filteredSemesters = this.semesters.filter(s => s.academicProgram.programId === progId);
    this.studentForm.batch = { batchId: 0 };
    this.studentForm.semester = { semesterId: 0 };
  }

  saveStudent(): void {
    if (this.studentForm.studentId) {
      this.studentSvc.update(this.studentForm.studentId, this.studentForm)
        .subscribe(() => this.afterSave());
    } else {
      this.studentSvc.create(this.studentForm)
        .subscribe(() => this.afterSave());
    }
  }

  private afterSave(): void {
    this.loadStudents();
    this.resetForm();
  }

  editStudent(st: Student): void {
    this.studentForm = { ...st };
    this.onDepartmentChange();
    this.onProgramChange();
  }

  deleteStudent(id: number): void {
    if (confirm('Delete this student?')) {
      this.studentSvc.delete(id).subscribe(() => {
        this.students = this.students.filter(x => x.studentId !== id);
      });
    }
  }

  resetForm(): void {
    this.studentForm = {
      studentName: '',
      studentEmail: '',
      studentContact: '',
      status: 'Active',
      department: { departmentId: 0 },
      academicProgram: { programId: 0 },
      batch: { batchId: 0 },
      semester: { semesterId: 0 }
    };
    this.filteredPrograms = [];
    this.filteredBatches = [];
    this.filteredSemesters = [];
  }
}
