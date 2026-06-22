export interface Treatment {
  id: string;
  name: string;
  category: string;
  totalSessions: number;
  usedSessions: number;
  nextDate: string;
  status: 'active' | 'completed' | 'paused';
  description: string;
  doctorName: string;
  image: string;
  startDate: string;
}

export interface PhotoRecord {
  id: string;
  treatmentId: string;
  treatmentName: string;
  date: string;
  imageUrl: string;
  angle: string;
  isPrivate: boolean;
  visibleToDoctor: boolean;
  notes: string;
  feeling: string;
  feelingScore: number;
  annotations: PhotoAnnotation[];
  doctorNote?: string;
  doctorNoteAt?: string;
}

export type UserRole = 'customer' | 'doctor';

export type ShareTemplate = 'compare' | 'timeline' | 'summary';

export interface ShareRecord {
  id: string;
  treatmentId: string;
  treatmentName: string;
  template: ShareTemplate;
  previewImage: string;
  summary: string;
  createdAt: string;
  photoCount: number;
}

export interface PhotoAnnotation {
  id: string;
  x: number;
  y: number;
  radius: number;
  note: string;
}

export interface Reminder {
  id: string;
  treatmentId: string;
  treatmentName: string;
  type: 'sunscreen' | 'diet' | 'hydration' | 'followup' | 'medication' | 'other';
  title: string;
  description: string;
  date: string;
  time: string;
  isCompleted: boolean;
}

export interface Message {
  id: string;
  treatmentId: string;
  treatmentName: string;
  content: string;
  type: 'question' | 'abnormal' | 'followup' | 'general';
  status: 'sent' | 'replied';
  createdAt: string;
  reply?: string;
  replyAt?: string;
  photos?: string[];
}

export interface AngleTemplate {
  id: string;
  name: string;
  angle: string;
  description: string;
  image: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
  phone: string;
  memberId: string;
}
