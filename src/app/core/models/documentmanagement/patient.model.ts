export interface Patient {
  id: string;            // e.g. P-10231
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  phone: string;
  lastVisit: string;     // ISO date
  ward?: string;
  photoInitials?: string;
  documentCount?: number;
}
