import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ColumnMapping, ExcelImportConfig } from '../../model/excel-import.models';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
export type ImportStep = 'upload' | 'mapping' | 'preview';
@Component({
    selector: 'airmid-excel-import',
    templateUrl: './airmid-excel-import.component.html',
    styleUrls: ['./airmid-excel-import.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AirmidExcelImportDialogComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
 
  currentStep: ImportStep = 'upload';
  steps: ImportStep[] = ['upload', 'mapping', 'preview'];
  completedSteps: Set<ImportStep> = new Set();
 
  // Upload state
  isDragging = false;
  uploadedFile: File | null = null;
  excelColumns: string[] = [];
  rawData: any[] = [];
 
  // Mapping state
  mappings: ColumnMapping[] = [];
 
  // Preview state
  previewData: any[] = [];
  previewColumns: string[] = [];
  isLoadingPreview = false;
  previewError: string | null = null;
 
  // Import state
  isImporting = false;
  importSuccess = false;
  importError: string | null = null;
 
  constructor(
    public dialogRef: MatDialogRef<AirmidExcelImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ExcelImportConfig,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
 
  ngOnInit(): void {
    this.initializeMappings();
  }
 
  initializeMappings(): void {
    this.mappings = this.config.columns.map((col) => ({
      targetColumn: col,
      sourceColumn: null,
    }));
  }
 
  get stepIndex(): number {
    return this.steps.indexOf(this.currentStep);
  }
 
  isStepEnabled(step: ImportStep): boolean {
    const index = this.steps.indexOf(step);
    if (index === 0) return true;
    const prev = this.steps[index - 1];
    return this.completedSteps.has(prev);
  }
 
  navigateTo(step: ImportStep): void {
    if (this.isStepEnabled(step)) {
      this.currentStep = step;
    }
  }
 
  // ── Upload Step ──────────────────────────────────────────────────────────
 
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
 
  onDragLeave(): void {
    this.isDragging = false;
  }
 
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }
 
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }
 
  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }
 
  processFile(file: File): void {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      alert('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }
 
    this.uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
 
      if (json.length > 0) {
        this.excelColumns = (json[0] as any[]).map((h) => String(h ?? '').trim()).filter(Boolean);
        this.rawData = json.slice(1).map((row: any[]) => {
          const obj: any = {};
          this.excelColumns.forEach((col, i) => (obj[col] = row[i] ?? null));
          return obj;
        });
        this.autoMap();
      }
      this.cdr.detectChanges();
    };
    reader.readAsArrayBuffer(file);
  }
 
  autoMap(): void {
    this.mappings = this.config.columns.map((col) => {
      const match = this.excelColumns.find(
        (ec) => ec.toLowerCase() === (col.label || col.key).toLowerCase()
      );
      return { targetColumn: col, sourceColumn: match ?? null };
    });
  }
 
  proceedToMapping(): void {
    if (!this.uploadedFile || this.excelColumns.length === 0) return;
    this.completedSteps.add('upload');
    this.currentStep = 'mapping';
  }
 
  removeFile(): void {
    this.uploadedFile = null;
    this.excelColumns = [];
    this.rawData = [];
    this.completedSteps.delete('upload');
    this.completedSteps.delete('mapping');
    this.completedSteps.delete('preview');
    this.currentStep = 'upload';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }
 
  // ── Mapping Step ─────────────────────────────────────────────────────────
 
  get requiredMappingsDone(): boolean {
    return this.config.columns
      .filter((c) => c.required)
      .every((c) => {
        const m = this.mappings.find((m) => m.targetColumn.key === c.key);
        return m?.sourceColumn != null;
      });
  }
 
  proceedToPreview(): void {
    if (!this.requiredMappingsDone) return;
    this.completedSteps.add('mapping');
    this.currentStep = 'preview';
    this.loadPreview();
  }
 
  // ── Preview Step ─────────────────────────────────────────────────────────
 
  buildMappedData(): any[] {
    return this.rawData.map((row) => {
      const mapped: any = {};
      this.mappings.forEach((m) => {
        if (m.sourceColumn) {
          mapped[m.targetColumn.key] = row[m.sourceColumn] ?? null;
        }
      });
      return mapped;
    });
  }
 
  loadPreview(): void {
    this.isLoadingPreview = true;
    this.previewError = null;
    const mappedData = this.buildMappedData();
 
    if (this.config.previewApi) {
      this.http.post<any[]>(this.config.previewApi, { data: mappedData }).subscribe({
        next: (res) => {
          this.previewData = res;
          this.previewColumns = this.mappings
            .filter((m) => m.sourceColumn)
            .map((m) => m.targetColumn.key);
          this.isLoadingPreview = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.previewError = err?.error?.message || 'Failed to load preview.';
          this.isLoadingPreview = false;
          // Fall back to local preview
          this.previewData = mappedData.slice(0, this.config.previewLimit ?? 10);
          this.previewColumns = this.mappings
            .filter((m) => m.sourceColumn)
            .map((m) => m.targetColumn.key);
          this.cdr.detectChanges();
        },
      });
    } else {
      this.previewData = mappedData.slice(0, this.config.previewLimit ?? 10);
      this.previewColumns = this.mappings
        .filter((m) => m.sourceColumn)
        .map((m) => m.targetColumn.key);
      this.isLoadingPreview = false;
    }
  }
 
  getColumnLabel(key: string): string {
    return this.config.columns.find((c) => c.key === key)?.label ?? key;
  }
 
  importData(): void {
    this.isImporting = true;
    this.importError = null;
    const mappedData = this.buildMappedData();
 
    this.http.post(this.config.importApi, { data: mappedData }).subscribe({
      next: () => {
        this.isImporting = false;
        this.importSuccess = true;
        this.completedSteps.add('preview');
        setTimeout(() => this.dialogRef.close({ success: true, count: mappedData.length }), 1500);
      },
      error: (err) => {
        this.isImporting = false;
        this.importError = err?.error?.message || 'Import failed. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
 
  close(): void {
    this.dialogRef.close(null);
  }
}