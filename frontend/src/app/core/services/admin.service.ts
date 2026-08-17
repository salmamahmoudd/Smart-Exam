import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CreateExamData, Exam } from '../interfaces/exam.interface';
import { CreateExamResponse } from '../interfaces/api.interface';
import { AdminDashboardResponse } from '../interfaces/admin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseURL}/api/exams`;
  private readonly adminApiUrl = `${environment.baseURL}/api/admin`;
  getDashboardStats(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(`${this.adminApiUrl}/dashboard`);
  }
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }
  createExam(data: CreateExamData): Observable<CreateExamResponse> {
    return this.http.post<CreateExamResponse>(this.apiUrl, data);
  }
  updateExam(id: string, data: CreateExamData): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, data);
  }
  deleteExam(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
