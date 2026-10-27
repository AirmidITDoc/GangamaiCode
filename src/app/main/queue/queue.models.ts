export type QueueStatus = 'waiting' | 'in' | 'out';
export interface QueueEntry {
  id: string; token: number; name: string; uhid: string; department: string; doctor: string;
  status: QueueStatus; createdAt: number; inAt?: number; outAt?: number;
}
export const DEPARTMENTS = ['OPD - General', 'Cardiology', 'Orthopedics', 'Pathology', 'Radiology', 'Dental'];
