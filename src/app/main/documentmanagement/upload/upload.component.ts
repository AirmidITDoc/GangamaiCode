import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileKind, HospitalDocument } from 'app/core/models/documentmanagement/document.model';
import { Category } from 'app/core/models/documentmanagement/category.model';
import { MockDataService, nextId } from '../mock-data.service';
import { Patient } from 'app/core/models/documentmanagement/patient.model';

interface StagedFile {
  file: File;
  title: string;
  kind: FileKind;
  tagsInput: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  @ViewChild('stepper') stepper?: MatStepper;

  categories: Category[] = [];

  /* Step 1 — patient */
  patientQuery = '';
  patientResults: Patient[] = [];
  selectedPatient: Patient | null = null;
  showNewPatientForm = false;
  newPatient: Partial<Patient> = { gender: 'Female' };

  /* Step 2 — category */
  selectedCategoryId: string | null = null;

  /* Step 3 — files */
  staged: StagedFile[] = [];
  isDragging = false;

  /* Step 4 */
  submitted = false;
  lastSubmittedCount = 0;

  constructor(private data: MockDataService, private snackBar: MatSnackBar) {
    this.data.categories$.subscribe((c) => (this.categories = c));
  }

  /* ---------------- Step 1 ---------------- */
  searchPatients(): void {
    this.patientResults = this.data.searchPatients(this.patientQuery);
  }

  pickPatient(p: Patient): void {
    this.selectedPatient = p;
    this.patientResults = [];
    this.patientQuery = '';
  }

  clearPatient(): void {
    this.selectedPatient = null;
  }

  /* ---------------- Step 2 ---------------- */
  onCategorySelect(id: string): void {
    this.selectedCategoryId = id;
  }

  get selectedCategoryPath(): string[] {
    if (!this.selectedCategoryId) return [];
    const match = this.data.getAllPaths().find((p) => p.id === this.selectedCategoryId);
    return match ? match.path : [];
  }

  /* ---------------- Step 3 ---------------- */
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files) this.addFiles(e.dataTransfer.files);
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) this.addFiles(input.files);
    input.value = '';
  }

  private addFiles(list: FileList): void {
    Array.from(list).forEach((file) => {
      this.staged.push({
        file,
        title: file.name.replace(/\.[^.]+$/, ''),
        kind: this.detectKind(file.name),
        tagsInput: '',
      });
    });
  }

  private detectKind(fileName: string): FileKind {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
    if (['txt'].includes(ext)) return 'text';
    return 'other';
  }

  removeStaged(i: number): void {
    this.staged.splice(i, 1);
  }

  /* ---------------- Step 4 ---------------- */
  submit(): void {
    if (!this.selectedPatient || !this.selectedCategoryId || !this.staged.length) return;
    const path = this.selectedCategoryPath;
    this.staged.forEach((s) => {
      const doc: HospitalDocument = {
        id: nextId('doc'),
        title: s.title || s.file.name,
        fileName: s.file.name,
        fileKind: s.kind,
        fileSizeKb: Math.max(1, Math.round(s.file.size / 1024)),
        categoryPath: path,
        categoryId: this.selectedCategoryId!,
        patientId: this.selectedPatient!.id,
        patientName: this.selectedPatient!.name,
        uploadedBy: 'Front Desk — S. Kulkarni',
        uploadedOn: new Date().toISOString(),
        tags: s.tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        thumbnailColor: '#0E7C7B',
      };
      this.data.addDocument(doc);
    });
    this.lastSubmittedCount = this.staged.length;
    this.submitted = true;
    this.snackBar.open(`${this.lastSubmittedCount} document(s) uploaded successfully`, 'Dismiss', { duration: 3000 });
  }

  startOver(): void {
    this.selectedPatient = null;
    this.selectedCategoryId = null;
    this.staged = [];
    this.submitted = false;
    this.stepper?.reset();
  }
}
