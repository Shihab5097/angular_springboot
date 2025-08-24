import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssignmentRequest } from '../model/assignment-request';
import { StudentCourseAssignment } from '../model/student-course-assignment';


@Injectable({ providedIn: 'root' })
export class AssignCourseStudentService {
  private baseUrl = 'http://localhost:8080/api/course-assignments';

  constructor(private http: HttpClient) { }

  // ????????? ???????? ???? ?????????
  assign(request: AssignmentRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/assign`, request);
  }

  // ???? ?????? ????? ???????? ???????? ??????
  getByCourse(courseId: number): Observable<StudentCourseAssignment[]> {
    return this.http.get<StudentCourseAssignment[]>(`${this.baseUrl}/by-course/${courseId}`);
  }

  // ????????????? ???? ????????? ?????
  removeStudent(courseId: number, studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove/${courseId}/${studentId}`);
  }
}
