
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  isImportant: boolean;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  fee: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  roll: string;
  guardianPhone: string;
  status: 'সক্রিয়' | 'নিষ্ক্রিয়';
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  examType: string;
  gpa: string;
  marks: Record<string, number>;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image?: string;
}

export interface Quiz {
  id: string;
  title: string;
  class: string;
  subject: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface OnlineExam {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number; // in minutes
  class: string;
  totalMarks: number;
}
