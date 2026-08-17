import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExamData, Exam } from '../interfaces/exam.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ExamsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseURL}/api/exams`;
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }
  createExam(data: CreateExamData): Observable<{ message: string; exam: Exam }> {
    return this.http.post<{
      message: string;
      exam: Exam;
    }>(this.apiUrl, data);
  }
  updateExam(id: string, data: CreateExamData): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, data);
  }
  deleteExam(id: string): Observable<{ message: string }> {
    return this.http.delete<{
      message: string;
    }>(`${this.apiUrl}/${id}`);
  }
}
