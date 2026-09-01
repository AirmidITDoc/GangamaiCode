export type FileKind = 'pdf' | 'image' | 'doc' | 'xls' | 'text' | 'other';
export interface DocumentFileModel {
  id: number;
  admissionId: number;
  docCatId: number;
  document?: File | null;
  orgFileName: string;
  savedFileName: string;
  fileTags?: string | null;
  createdBy: number;
  createdDate: Date;
  docNo: string;
  fileKind: FileKind;
  fileSize: number;
}