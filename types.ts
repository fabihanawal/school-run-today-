
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
  colorClass: string;
  borderClass: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  designation: string;
  subject?: string;
  mobile: string;
  type: 'TEACHER' | 'STAFF';
  photo?: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: string;
  content?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

export interface SiteSettings {
  schoolName: string;
  tagline: string;
  phone1: string;
  email: string;
  address: string;
  principalName: string;
  principalMsg: string;
  principalPhoto: string;
  chairmanName: string;
  chairmanMsg: string;
  chairmanPhoto: string;
  bannerImage: string;
  homeLayout: 'classic' | 'modern' | 'focus'; // New field for dynamic layout
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
