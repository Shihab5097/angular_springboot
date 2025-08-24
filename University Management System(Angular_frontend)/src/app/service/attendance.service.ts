import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../model/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private base = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  getByCourse(courseId: number): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.base}/by-course/${courseId}`);
  }

  saveAll(records: Attendance[]): Observable<void> {
    return this.http.post<void>(`${this.base}/save-bulk`, records);
  }
}
