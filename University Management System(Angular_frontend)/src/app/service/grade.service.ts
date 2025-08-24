import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Course } from '../model/course.model';
import { Department } from '../model/department.model';
import { GradeModel, ResultModel } from '../model/grade.model';
import { Semester } from '../model/semester.model';
import { Student } from '../model/student.model';

@Injectable({ providedIn: 'root' })
export class GradeService {
  private readonly API_BASE = 'http://localhost:8080/api';
  private readonly GRADES = `${this.API_BASE}/grades`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.API_BASE}/departments`);
  }

  getSemesters(): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.API_BASE}/semester`);
  }

  getSemestersByDepartment(deptId: number): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.API_BASE}/semester/by-department/${deptId}`).pipe(
      catchError(() => this.getSemesters())
    );
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_BASE}/courses`);
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.API_BASE}/students`);
  }

  getResultsByParams(deptId: number, semId: number, courseId: number): Observable<ResultModel[]> {
    return this.http.get<ResultModel[]>(`${this.API_BASE}/results/by-params/${deptId}/${semId}/${courseId}`);
  }

  saveGradesBulk(grades: GradeModel[]): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    return this.http.post<void>(`${this.GRADES}/bulk`, grades, { headers });
  }

  getGradesByParams(deptId: number, semId: number, courseId: number): Observable<GradeModel[]> {
    return this.http.get<GradeModel[]>(`${this.GRADES}/by-params/${deptId}/${semId}/${courseId}`);
  }

  deleteGrade(gradeId: number): Observable<void> {
    return this.http.delete<void>(`${this.GRADES}/${gradeId}`);
  }
}
