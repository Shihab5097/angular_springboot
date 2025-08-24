import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../model/result.model';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private base = 'http://localhost:8080/api/results';

  constructor(private http: HttpClient) {}

  saveAll(results: Result[]): Observable<void> {
    return this.http.post<void>(`${this.base}/bulk`, results);
  }

  getByParams(deptId: number, semId: number, courseId: number): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.base}/by-params/${deptId}/${semId}/${courseId}`);
  }

  deleteResult(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
