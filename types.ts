
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  features: string[];
  colorClass: string; // e.g., 'rose-50', 'emerald-50'
  borderClass: string; // e.g., 'border-rose-200'
}

export interface StudentProfile {
  id: string;
  name: string;
  class: string;
  section: string; // শাখা
  roll: string;
  fatherName: string;
  motherName: string;
  parentPhone: string; // পিতা/মাতার মোবাইল
  address: string;
  studentPhoto?: string;
  academicResults: TermResult[];
}

export interface StaffProfile {
  id: string;
  name: string;
  designation: string;
  subject?: string; // শিক্ষকদের জন্য বিষয়
  mobile: string;
  type: 'TEACHER' | 'STAFF';
  photo?: string;
}

export interface SubjectMark {
  subject: string;
  mark: number;
  grade: string;
  point: number;
}

export interface TermResult {
  id: string;
  termTitle: string;
  subjects: SubjectMark[];
  totalGPA: number;
  finalGrade: string;
  isPassed: boolean;
  date: string;
}

export interface QuizRecord {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}
