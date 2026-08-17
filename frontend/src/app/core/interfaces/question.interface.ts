export interface Question {
  _id: string;
  examId: string;
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface QuestionFormData {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CreateQuestionData {
  examId: string;
  question: string;
  options: string[];
  correctAnswer: string;
}
