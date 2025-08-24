import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../service/department.service';
import { SemesterService } from '../service/semester.service';
import { CourseService } from '../service/course.service';
import { AssignCourseStudentService } from '../service/assign-course-student.service';
import { AttendanceService } from '../service/attendance.service';
import { ResultService } from '../service/result.service';
import { Department } from '../model/department.model';
import { Semester } from '../model/semester.model';
import { Course } from '../model/course.model';
import { StudentCourseAssignment } from '../model/student-course-assignment';
import { Result } from '../model/result.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  departments: Department[] = [];
  semesters: Semester[] = [];
  courses: Course[] = [];

  selDeptId: number | null = null;
  selSemId: number | null = null;
  selCourseId: number | null = null;

  assignments: StudentCourseAssignment[] = [];
  attendancePct = new Map<number, number>();
  results: Result[] = [];

  editMap = new Map<number, Result>();

  constructor(
    private deptSvc: DepartmentService,
    private semSvc: SemesterService,
    private courseSvc: CourseService,
    private assignSvc: AssignCourseStudentService,
    private attSvc: AttendanceService,
    private resSvc: ResultService
  ) {}

  ngOnInit(): void {
    this.deptSvc.getAll().subscribe(d => this.departments = d);
    this.courseSvc.getAllCourses().subscribe(c => this.courses = c);
  }

  onDeptChange(): void {
    if (!this.selDeptId) return;
    this.semSvc.getByDepartment(this.selDeptId).subscribe(s => this.semesters = s);
    this.selSemId = this.selCourseId = null;
    this.assignments = [];
    this.results = [];
    this.editMap.clear();
    this.attendancePct.clear();
  }

  onSemChange(): void {
    this.selCourseId = null;
    this.assignments = [];
    this.results = [];
    this.editMap.clear();
    this.attendancePct.clear();
  }

  onCourseChange(): void {
    if (!(this.selDeptId && this.selSemId && this.selCourseId)) return;

    this.assignSvc.getByCourse(this.selCourseId).subscribe(aList => {
      this.assignments = aList;

      this.attSvc.getByCourse(this.selCourseId!).subscribe(all => {
        this.attendancePct.clear();
        aList.forEach(a => {
          const recs = all.filter(x => x.studentId === a.student.studentId);
          const pct = recs.length ? Math.round(100 * recs.filter(x => x.present).length / recs.length) : 0;
          this.attendancePct.set(a.student.studentId!, pct);
        });
      });

      this.resSvc.getByParams(this.selDeptId!, this.selSemId!, this.selCourseId!).subscribe(rList => {
        this.results = rList;
        this.editMap.clear();
        rList.forEach(r => this.editMap.set(r.studentId, { ...r }));
      });
    });
  }

  get uniqueStudents(): number[] {
    const ids = this.assignments.map(a => a.student.studentId!);
    return Array.from(new Set(ids));
  }

  getStudentName(sid: number): string {
    const match = this.assignments.find(a => a.student.studentId === sid);
    return match ? (match.student.studentName || '') : '';
  }

  getPct(sid: number): number {
    return this.attendancePct.get(sid) || 0;
  }

  getDraft(sid: number): Result {
    if (!this.editMap.has(sid)) {
      this.editMap.set(sid, {
        departmentId: this.selDeptId!,
        semesterId: this.selSemId!,
        courseId: this.selCourseId!,
        studentId: sid,
        classTestMark: 0,
        labMark: 0,
        attendancePct: this.getPct(sid),
        attendanceMark: 0,
        finalExamMark: 0
      });
    }
    return this.editMap.get(sid)!;
  }

  saveOne(sid: number): void {
    const payload = [this.getDraft(sid)];
    this.resSvc.saveAll(payload).subscribe(() => {
      alert('Saved');
      this.onCourseChange();
    });
  }

  saveAll(): void {
    const payload = Array.from(this.editMap.values());
    this.resSvc.saveAll(payload).subscribe(() => {
      alert('Results saved');
      this.onCourseChange();
    });
  }

  deleteByStudent(sid: number): void {
    const draft = this.getDraft(sid);
    if (!draft.resultId) {
      this.resetDraft(sid);
      return;
    }
    this.resSvc.deleteResult(draft.resultId).subscribe({
      next: () => {
        this.results = this.results.filter(r => r.resultId !== draft.resultId);
        this.resetDraft(sid);
        alert('Result deleted');
      },
      error: () => {
        alert('Failed to delete result');
      }
    });
  }

  resetDraft(sid: number): void {
    const existing = this.getDraft(sid);
    this.editMap.set(sid, {
      departmentId: existing.departmentId,
      semesterId: existing.semesterId,
      courseId: existing.courseId,
      studentId: sid,
      classTestMark: 0,
      labMark: 0,
      attendancePct: this.getPct(sid),
      attendanceMark: 0,
      finalExamMark: 0
    });
  }

  calculateTotalMarks(result: Result): number {
    return result.classTestMark + result.labMark + result.attendanceMark + result.finalExamMark;
  }
}
