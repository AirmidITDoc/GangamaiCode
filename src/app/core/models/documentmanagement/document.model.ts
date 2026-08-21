export type FileKind = 'pdf' | 'image' | 'doc' | 'xls' | 'text' | 'other';

export interface HospitalDocument {
  id: string;
  title: string;
  fileName: string;
  fileKind: FileKind;
  fileSizeKb: number;
  categoryPath: string[];   // e.g. ['Clinical Records', 'Radiology', 'CT Scan', 'Head']
  categoryId: string;       // id of the leaf category
  patientId: number;
  patientName: string;
  uploadedBy: string;
  uploadedOn: string;       // ISO date
  tags: string[];
  notes?: string;
  thumbnailColor?: string;  // used to render a mock thumbnail
}
