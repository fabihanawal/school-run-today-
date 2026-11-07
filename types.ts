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
  ageGroup?: string;
  duration?: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  designation: string;
  subject?: string;
  mobile: string;
  email?: string;
  qualification?: string;
  type: 'TEACHER' | 'STAFF';
  photo?: string;
  joinDate?: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  type: 'ACADEMIC' | 'EXAM' | 'HOLIDAY' | 'ADMISSION' | 'GENERAL';
  content?: string;
  pinned?: boolean;
  attachmentName?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category?: 'CAMPUS' | 'EVENTS' | 'SPORTS' | 'CLASSROOM';
  date?: string;
}

export interface SliderImage {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface SchoolStat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read?: boolean;
}

export interface SiteSettings {
  schoolName: string;
  tagline: string;
  eiin: string;
  estYear: string;
  motto: string;
  logo?: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  officeHours: string;
  googleMapUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  whatsapp: string;
  principalName: string;
  principalDesignation: string;
  principalMsg: string;
  principalPhoto: string;
  chairmanName: string;
  chairmanDesignation: string;
  chairmanMsg: string;
  chairmanPhoto: string;
  bannerImage: string;
  scrollingHeadline: string;
  sliderImages: SliderImage[];
  aboutTitle: string;
  aboutHistory: string;
  aboutMission: string;
  aboutVision: string;
  aboutImage: string;
  stats: SchoolStat[];
  features: FeatureItem[];
  admissionOpen: boolean;
  admissionDeadline: string;
  currentSession: string;
  homeLayout: 'classic' | 'modern' | 'focus';
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

export interface AdmissionSubmission {
  id: string;
  trackingNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  targetClass: string;
  gender: string;
  phone: string;
  address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  studentPhoto?: string;
  birthCertificate?: string;
  fatherPhoto?: string;
  motherPhoto?: string;
  remarks?: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  roll: string;
  section?: string;
  guardianPhone: string;
  bloodGroup?: string;
  studentPhoto?: string;
  academicResults?: TermResult[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  durationMinutes: number;
  questions: QuizQuestion[];
  createdDate: string;
}
