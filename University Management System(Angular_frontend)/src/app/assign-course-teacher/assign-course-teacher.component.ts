// src/app/assign-course-teacher/assign-course-teacher.component.ts
import { Component, OnInit } from '@angular/core';
import { AssignCourseTeacherService } from '../service/assign-course-teacher.service';
import { Department } from '../model/department.model';
import { Teacher }    from '../model/teacher.model';
import { AcademicProgram } from '../model/academicProgram.model';
import { Batch }      from '../model/batch.model';
import { Semester }   from '../model/semester.model';
import { Course }     from '../model/course.model';
import { AssignmentRequestTeacher } from '../model/assignment-request-teacher.model';
import { TeacherCourseAssignment }  from '../model/teacher-course-assignment.model';

@Component({
  selector: 'app-assign-course-teacher',
  templateUrl: './assign-course-teacher.component.html',
  styleUrls: ['./assign-course-teacher.component.css']
})
export class AssignCourseTeacherComponent implements OnInit {
  // dropdown data sources
  departments: Department[]      = [];
  allTeachers: Teacher[]         = [];
  teachers:    Teacher[]         = [];
  allPrograms: AcademicProgram[] = [];
  programs:    AcademicProgram[] = [];
  allBatches:  Batch[]           = [];
  batches:     Batch[]           = [];
  allSemesters: Semester[]       = [];
  semesters:   Semester[]        = [];
  courses:     Course[]          = [];
  assignments: TeacherCourseAssignment[] = [];

  // selected IDs
  selDeptId:    number|null = null;
  selTeacherId: number|null = null;
  selProgId:    number|null = null;
  selBatchId:   number|null = null;
  selSemId:     number|null = null;
  selCourseId:  number|null = null;

  // lookup maps
  private teacherMap = new Map<number,Teacher>();
  private courseMap  = new Map<number,Course>();

  constructor(private svc: AssignCourseTeacherService) {}

  ngOnInit(): void {
    // load dropdowns
    this.svc.getDepartments().subscribe(d => this.departments = d);
    this.svc.getTeachers().subscribe(t => {
      this.allTeachers = t;
      t.forEach(x => { if (x.teacherId != null) this.teacherMap.set(x.teacherId, x); });
    });
    this.svc.getPrograms().subscribe(p => this.allPrograms = p);
    this.svc.getBatches().subscribe(b => this.allBatches = b);
    this.svc.getSemesters().subscribe(s => this.allSemesters = s);
    this.svc.getCourses().subscribe(c => {
      this.courses = c;
      c.forEach(x => { if (x.courseId != null) this.courseMap.set(x.courseId, x); });
    });
    // load existing assignments
    this.svc.getAllTeacherAssignments().subscribe(a => this.assignments = a);
  }

  onDeptChange(): void {
    this.teachers = this.allTeachers.filter(t =>
      t.department.departmentId === this.selDeptId
    );
    this.programs = this.allPrograms.filter(p =>
      p.department.departmentId === this.selDeptId
    );
    this.resetBelow('dept');
  }

  onProgChange(): void {
    this.batches = this.allBatches.filter(b =>
      b.academicProgram.programId === this.selProgId
    );
    this.resetBelow('prog');
  }

  onBatchChange(): void {
    this.semesters = this.allSemesters.filter(s =>
      s.academicProgram.programId === this.selProgId
    );
    this.resetBelow('batch');
  }

  onSemChange(): void {
    // no action—courses remain all loaded
  }

  assign(): void {
    if (!this.selTeacherId || !this.selCourseId) return;
    const req: AssignmentRequestTeacher = {
      teacherId: this.selTeacherId,
      courseId:  this.selCourseId
    };
    this.svc.assignTeacher(req).subscribe(() => {
      this.svc.getAllTeacherAssignments()
        .subscribe(a => this.assignments = a);
    });
  }

  // helper getters (null‑safe)
  getTeacherName(id: number): string {
    const t = this.teacherMap.get(id);
    return t ? t.teacherName : '';
  }

  getCourseTitle(id: number): string {
    const c = this.courseMap.get(id);
    return c ? c.courseTitle : '';
  }

  getProgramName(id: number): string {
    const c = this.courseMap.get(id);
    return c && c.program ? c.program.programName : '';
  }

  getDepartmentName(id: number): string {
    const c = this.courseMap.get(id);
    return c && c.program && c.program.department
      ? c.program.department.departmentName
      : '';
  }

  private resetBelow(level: 'dept'|'prog'|'batch') {
    if (level === 'dept') {
      this.selTeacherId = null;
      this.selProgId    = null;
    }
    if (level !== 'batch') {
      this.selBatchId = null;
      this.semesters  = [];
      this.selSemId   = null;
    }
    // courses stay loaded
    this.selCourseId = null;
  }
}
