import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Batch } from '../model/batch.model';

@Injectable({ providedIn: 'root' })
export class BatchService {
  private baseUrl = 'http://localhost:8080/api/batches';

  constructor(private http: HttpClient) {}

  getAllBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${this.baseUrl}/all`);
  }

  addBatch(batch: Batch): Observable<Batch> {
    return this.http.post<Batch>(`${this.baseUrl}/add`, batch);
  }

  updateBatch(batch: Batch): Observable<Batch> {
    return this.http.put<Batch>(`${this.baseUrl}/update/${batch.batchId}`, batch);
  }

  deleteBatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}