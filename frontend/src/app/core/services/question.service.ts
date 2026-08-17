import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, CreateQuestionData, QuestionFormData } from '../interfaces/question.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseURL}/api/questions`;
  getQuestionsByExamId(examId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/exam/${examId}`);
  }
  getAdminQuestionsByExamId(examId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/admin/exam/${examId}`);
  }
  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }
  deleteQuestion(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
  createQuestion(data: CreateQuestionData): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, data);
  }
  updateQuestion(id: string, data: QuestionFormData): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, data);
  }
}
