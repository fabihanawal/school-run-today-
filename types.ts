
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface StudentProfile {
  id: string;
  name: string;
  class: string;
  roll: string;
  guardianPhone: string;
  address: string;
  studentPhoto?: string;
  fatherName?: string;
  fatherPhoto?: string;
  motherName?: string;
  motherPhoto?: string;
  results: QuizRecord[];
  submissions: HomeworkSubmission[];
  academicResults: TermResult[];
}

export interface SubjectMark {
  subject: string;
  mark: number;
  grade: string;
  point: number;
}

export interface TermResult {
  id: string;
  termTitle: string; // e.g., "বার্ষিক পরীক্ষা ২০২৪"
  subjects: SubjectMark[];
  totalGPA: number;
  finalGrade: string;
  isPassed: boolean;
  date: string;
}

export interface HomeworkSubmission {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  type: 'text' | 'image' | 'audio' | 'video';
  content: string; 
  date: string;
  status: 'pending' | 'reviewed';
  feedback?: string;
}

export interface QuizRecord {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}
