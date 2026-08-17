import { Exam } from './exam.interface';
import { Result } from './result.interface';

export interface CreateExamResponse {
  message: string;
  exam: Exam;
}

export interface SubmitExamResponse {
  message: string;
  result: Result;
}

export interface ResultsResponse {
  message: string;
  results: Result[];
}

export interface ResultResponse {
  message: string;
  result: Result;
}

export interface UploadProfileImageResponse {
  message: string;
  image: string;
}
