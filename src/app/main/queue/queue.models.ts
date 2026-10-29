export type QueueStatus = 'waiting' | 'in' | 'out';
export interface QueueEntry {
  // id: string; token: number; name: string; uhid: string; department: string; doctor: string;
  // status: QueueStatus; createdAt: number; inAt?: number; outAt?: number;

  regNoWithPrefix: string; patientName: string; vistDateTime: string; doctorId: number; visitId: number;doctor:string;
  status: QueueStatus;conStartTime:Date;conEndTime:Date;
}
export const DEPARTMENTS = ['OPD - General', 'Cardiology', 'Orthopedics', 'Pathology', 'Radiology', 'Dental'];
