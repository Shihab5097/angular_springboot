
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcademicProgram } from '../model/academicProgram.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {
  private baseUrl = 'http://localhost:8080/api/academic-programs';

  constructor(private http: HttpClient) { }

  
  getAll(): Observable<AcademicProgram[]> {
    return this.http.get<AcademicProgram[]>(this.baseUrl);
  }

  
  getById(id: number): Observable<AcademicProgram> {
    return this.http.get<AcademicProgram>(`${this.baseUrl}/${id}`);
  }

  
  getByDepartment(deptId: number): Observable<AcademicProgram[]> {
    return this.http.get<AcademicProgram[]>(`${this.baseUrl}/by-department/${deptId}`);
  }

  
  create(program: AcademicProgram): Observable<AcademicProgram> {
    return this.http.post<AcademicProgram>(this.baseUrl, program);
  }

  
  update(id: number, program: AcademicProgram): Observable<AcademicProgram> {
    return this.http.put<AcademicProgram>(`${this.baseUrl}/${id}`, program);
  }

  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
