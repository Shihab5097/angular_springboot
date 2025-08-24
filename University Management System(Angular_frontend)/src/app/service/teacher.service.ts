import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from '../model/teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private baseUrl = 'http://localhost:8080/api/teachers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.baseUrl);
  }

  create(teacher: Teacher): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, teacher);
  }

  update(id: number, teacher: Teacher): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, teacher);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
