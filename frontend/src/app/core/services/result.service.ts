import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SubmitExamResponse, ResultResponse, ResultsResponse } from '../interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseURL}/api/results`;
  submitExam(data: {
    userId: string;
    examId: string;
    answers: {
      questionId: string;
      answer: string;
    }[];
  }): Observable<SubmitExamResponse> {
    return this.http.post<SubmitExamResponse>(`${this.apiUrl}/submit`, data);
  }
  getResultById(resultId: string): Observable<ResultResponse> {
    return this.http.get<ResultResponse>(`${this.apiUrl}/${resultId}`);
  }
  getMyResults(): Observable<ResultsResponse> {
    return this.http.get<ResultsResponse>(`${this.apiUrl}/my-results`);
  }
  deleteResult(resultId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${resultId}`);
  }
}
