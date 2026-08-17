export interface Result {
  _id: string;
  userId: string;
  examId: {
    _id: string;
    title: string;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  createdAt?: string;
  updatedAt?: string;
}
