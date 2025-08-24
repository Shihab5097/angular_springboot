import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { Course } from '../model/course.model';
import { Department } from '../model/department.model';
import { GradeModel, ResultModel, GradeCourse } from '../model/grade.model';
import { Semester } from '../model/semester.model';
import { Student } from '../model/student.model';
import { GradeService } from '../service/grade.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.css']
})
export class GradeComponent implements OnInit {
  departments: Department[] = [];
  semesters: Semester[] = [];
  courses: Course[] = [];
  students: Student[] = [];
  selectedDepartment?: Department;
  selectedSemester?: Semester;
  computedGrades: GradeModel[] = [];
  busy = false;

  constructor(private gradeSvc: GradeService) {}

  ngOnInit(): void {
    this.loadInitial();
  }

  private loadInitial(): void {
    this.busy = true;
    forkJoin({
      depts: this.gradeSvc.getDepartments(),
      courses: this.gradeSvc.getCourses(),
      students: this.gradeSvc.getStudents()
    }).subscribe({
      next: ({ depts, courses, students }) => {
        this.departments = depts || [];
        this.courses = courses || [];
        this.students = students || [];
        if (this.departments.length) {
          this.selectedDepartment = this.departments[0];
          this.loadSemestersForDept();
        } else {
          this.busy = false;
        }
      },
      error: () => { this.busy = false; alert('Failed to load initial data'); }
    });
  }

  private loadSemestersForDept(): void {
    const deptId = this.selectedDepartment?.departmentId!;
    if (!deptId) { this.busy = false; return; }
    this.busy = true;
    this.gradeSvc.getSemestersByDepartment(deptId).subscribe({
      next: (sems) => {
        this.semesters = sems || [];
        this.selectedSemester = this.semesters.length ? this.semesters[0] : undefined;
        if (this.selectedSemester) {
          this.computeGrades();
        } else {
          this.computedGrades = [];
          this.busy = false;
        }
      },
      error: () => { this.busy = false; alert('Failed to load semesters'); }
    });
  }

  onDepartmentChange(d: Department): void {
    this.selectedDepartment = d;
    this.semesters = [];
    this.selectedSemester = undefined;
    this.computedGrades = [];
    this.loadSemestersForDept();
  }

  onSemesterChange(s: Semester): void {
    this.selectedSemester = s;
    this.computedGrades = [];
    this.computeGrades();
  }

  private gradeFromPercent(percent: number): { letter: string; cgpa: number } {
    if (percent >= 80) return { letter: 'A+', cgpa: 4.00 };
    if (percent >= 75) return { letter: 'A', cgpa: 3.75 };
    if (percent >= 70) return { letter: 'A-', cgpa: 3.50 };
    if (percent >= 65) return { letter: 'B+', cgpa: 3.25 };
    if (percent >= 60) return { letter: 'B', cgpa: 3.00 };
    if (percent >= 55) return { letter: 'B-', cgpa: 2.75 };
    if (percent >= 50) return { letter: 'C+', cgpa: 2.50 };
    if (percent >= 45) return { letter: 'C', cgpa: 2.25 };
    if (percent >= 40) return { letter: 'D', cgpa: 2.00 };
    return { letter: 'F', cgpa: 0.00 };
  }

  private computeGrades(): void {
    const deptId = this.selectedDepartment?.departmentId!;
    const semId = this.selectedSemester?.semesterId!;
    if (!deptId || !semId) return;

    this.busy = true;
    this.computedGrades = [];

    const validCourses = this.courses.filter(c => (c as any).courseId !== undefined);
    const requests = validCourses.map(c =>
      this.gradeSvc.getResultsByParams(deptId, semId, (c as any).courseId as number).pipe(
        catchError(() => of([] as ResultModel[]))
      )
    );

    forkJoin(requests).subscribe({
      next: (resultsPerCourse: ResultModel[][]) => {
        const detailsByStudent = new Map<number, GradeCourse[]>();
        const sumByStudent = new Map<number, number>();
        const countByStudent = new Map<number, number>();

        validCourses.forEach((course, idx) => {
          const results = resultsPerCourse[idx] || [];
          results.forEach(r => {
            const total = typeof r.totalMark === 'number'
              ? r.totalMark
              : (r.classTestMark + r.labMark + r.attendanceMark + r.finalExamMark);
            const sid = r.studentId;
            const arr = detailsByStudent.get(sid) || [];
            arr.push({
              courseId: (course as any).courseId as number,
              courseName: (course as any).courseTitle ?? '',
              totalMarks: total
            });
            detailsByStudent.set(sid, arr);
            sumByStudent.set(sid, (sumByStudent.get(sid) || 0) + total);
            countByStudent.set(sid, (countByStudent.get(sid) || 0) + 1);
          });
        });

        const nameById = new Map<number, string>();
        (this.students || []).forEach(s => {
          const id = (s.studentId ?? -1) as number;
          const nm = (s.studentName ?? '') as string;
          if (id >= 0) nameById.set(id, nm);
        });

        const out: GradeModel[] = [];
        sumByStudent.forEach((sum, sid) => {
          const taken = countByStudent.get(sid) || 0;
          const percent = taken === 0 ? 0 : (sum / (taken * 100)) * 100;
          const g = this.gradeFromPercent(percent);
          out.push({
            departmentId: deptId,
            semesterId: semId,
            studentId: sid,
            studentName: nameById.get(sid) || '',
            assignedCourses: detailsByStudent.get(sid) || [],
            totalMarks: sum,
            cgpa: g.cgpa,
            grade: g.letter,
            remarks: 'No Remarks'
          });
        });

        this.computedGrades = out.sort((a, b) => a.studentName.localeCompare(b.studentName));
        this.busy = false;
      },
      error: () => { this.busy = false; alert('Failed to compute grades'); }
    });
  }

  saveAll(): void {
    if (!this.computedGrades.length) return;
    this.busy = true;
    this.gradeSvc.saveGradesBulk(this.computedGrades).subscribe({
      next: () => { this.busy = false; alert('Grades saved'); },
      error: (e) => { this.busy = false; alert('Failed to save: ' + (e?.message || e)); }
    });
  }
}
