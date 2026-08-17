export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalExams: number;
  availableExams: number;
  lockedExams: number;
  totalQuestions: number;
  totalResults: number;
  averageScore: number;
}

export interface RecentUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt?: string;
}

export interface RecentResult {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  examId?: {
    _id: string;
    title: string;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  createdAt?: string;
}

export interface PopularExam {
  _id: string;
  title: string;
  status: 'available' | 'locked';
  time: number;
  attempts: number;
  averageScore: number;
}

export interface AdminDashboardResponse {
  stats: AdminStats;
  recentUsers: RecentUser[];
  recentResults: RecentResult[];
  popularExams: PopularExam[];
}
