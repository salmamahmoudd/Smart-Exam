export interface Exam {
  _id: string;
  title: string;
  description?: string;
  status: 'available' | 'locked';
  time: number;
  questionsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExamData {
  title: string;
  description: string;
  time: number;
  status: 'available' | 'locked';
}
