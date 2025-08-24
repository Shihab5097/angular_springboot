// src/app/service/assign-course-teacher.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignmentRequestTeacher } from '../model/assignment-request-teacher.model';
import { TeacherCourseAssignment } from '../model/teacher-course-assignment.model';
import { Batch } from '../model/batch.model';
import { Semester } from '../model/semester.model';
import { Course } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class AssignCourseTeacherService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // lookup endpoints
  getDepartments() {
    return this.http.get<any[]>(`${this.base}/departments`);
  }
  getTeachers() {
    return this.http.get<any[]>(`${this.base}/teachers`);
  }
  getPrograms() {
    return this.http.get<any[]>(`${this.base}/academic-programs`);
  }
  getBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.base}/batches/all`);
  }
  getSemesters(): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.base}/semester`);
  }
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.base}/courses`);
  }

  // assignment actions
  assignTeacher(req: AssignmentRequestTeacher): Observable<void> {
    return this.http.post<void>(`${this.base}/course-assignments/teacher/assign`, req);
  }
  getAllTeacherAssignments(): Observable<TeacherCourseAssignment[]> {
    return this.http.get<TeacherCourseAssignment[]>(
      `${this.base}/course-assignments/teacher/all`
    );
  }
}
