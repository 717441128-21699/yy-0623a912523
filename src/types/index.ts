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

export type DoctorAdviceType = 'observe' | 'followup' | 'care';

export const DoctorAdviceLabels: Record<DoctorAdviceType, string> = {
  observe: '继续观察',
  followup: '需要复诊',
  care: '护理注意'
};

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
  doctorAdviceType?: DoctorAdviceType;
}

export type UserRole = 'customer' | 'doctor';

export type ShareTemplate = 'compare' | 'timeline' | 'summary';

export type ShareTarget = 'self' | 'doctor' | 'family';
export type ShareValidDays = 7 | 30;

export const ShareTargetLabels: Record<ShareTarget, string> = {
  self: '发给自己',
  doctor: '发给医生',
  family: '发给家人'
};

export interface ShareRecord {
  id: string;
  treatmentId: string;
  treatmentName: string;
  template: ShareTemplate;
  previewImage: string;
  summary: string;
  createdAt: string;
  photoCount: number;
  target: ShareTarget;
  validDays: ShareValidDays;
  authorized: boolean;
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
  fromDoctor?: boolean;
  relatedPhotoId?: string;
  relatedPhotoUrl?: string;
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
