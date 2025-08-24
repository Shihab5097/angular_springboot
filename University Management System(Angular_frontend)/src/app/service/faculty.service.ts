// frontend/src/app/service/faculty.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../model/faculty.model';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private baseUrl = 'http://localhost:8080/api/faculties';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.baseUrl);
  }

  getById(id: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.baseUrl}/${id}`);
  }

  create(fac: Faculty): Observable<Faculty> {
    return this.http.post<Faculty>(this.baseUrl, fac);
  }

  update(id: number, fac: Faculty): Observable<Faculty> {
    return this.http.put<Faculty>(`${this.baseUrl}/${id}`, fac);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
