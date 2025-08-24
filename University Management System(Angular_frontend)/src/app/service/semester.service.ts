import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Semester } from '../model/semester.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SemesterService {
  private baseUrl = 'http://localhost:8080/api/semester';

  constructor(private http: HttpClient) {}

  create(semester: Semester): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, semester);
  }

  getAll(): Observable<Semester[]> {
    return this.http.get<Semester[]>(this.baseUrl);
  }

  update(id: number, semester: Semester): Observable<Semester> {
    return this.http.put<Semester>(`${this.baseUrl}/update/${id}`, semester);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getByDepartment(deptId: number): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.baseUrl}/by-department/${deptId}`);
  }

  getByProgram(programId: number): Observable<Semester[]> {
    return this.http.get<Semester[]>(`${this.baseUrl}/by-program/${programId}`);
  }
}
