import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ColumnMapping, ExcelImportConfig, PreviewApiResponse, PreviewRow } from '../../model/excel-import.models';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ExcelImportService } from '../../services/excel-import.service';
import { MatTableDataSource } from '@angular/material/table';
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

    // ── Upload state ────────────────────────────────────────────────
    isDragging = false;
    uploadedFile: File | null = null;
    excelColumns: string[] = [];

    // ── Mapping state ───────────────────────────────────────────────
    mappings: ColumnMapping[] = [];

    // ── Preview state ───────────────────────────────────────────────
    isLoadingPreview = false;
    previewError: string | null = null;
    totalRows = 0;
    validCount = 0;
    invalidCount = 0;
    showOnlyErrors = false;                 // toggle to filter invalid rows

    // ── Import state ────────────────────────────────────────────────
    isImporting = false;
    importSuccess = false;
    importError: string | null = null;

    constructor(
        public dialogRef: MatDialogRef<AirmidExcelImportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public config: ExcelImportConfig,
        private http: HttpClient,
        private cdr: ChangeDetectorRef, private _service: ExcelImportService
    ) { }

    ngOnInit(): void {
        this.initializeMappings();
    }

    initializeMappings(): void {
        this.mappings = this.config.columns.map((col) => ({
            targetColumn: col,
            sourceColumn: null,
        }));
    }

    isStepEnabled(step: ImportStep): boolean {
        const index = this.steps.indexOf(step);
        if (index === 0) return true;
        return this.completedSteps.has(this.steps[index - 1]);
    }

    navigateTo(step: ImportStep): void {
        if (this.isStepEnabled(step)) this.currentStep = step;
    }

    // ── Upload ──────────────────────────────────────────────────────

    onDragOver(e: DragEvent): void { e.preventDefault(); this.isDragging = true; }
    onDragLeave(): void { this.isDragging = false; }

    onDrop(e: DragEvent): void {
        e.preventDefault();
        this.isDragging = false;
        const file = e.dataTransfer?.files[0];
        if (file) this.processFile(file);
    }

    onFileSelected(e: Event): void {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) this.processFile(file);
    }

    openFilePicker(): void { this.fileInput.nativeElement.click(); }

    processFile(file: File): void {
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            alert('Please upload a valid Excel file (.xlsx or .xls)');
            return;
        }
        this.uploadedFile = file;

        // Read ONLY the header row to populate mapping dropdowns.
        // We do NOT parse all rows — the API will do that.
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target!.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array', sheetRows: 1 }); // only header row
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const headers: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as any[] ?? [];
            this.excelColumns = headers.map((h) => String(h ?? '').trim()).filter(Boolean);
            this.autoMap();
            this.cdr.detectChanges();
        };
        reader.readAsArrayBuffer(file);
    }

    autoMap(): void {
        this.mappings = this.config.columns.map((col) => {
            const match = this.excelColumns.find(
                (ec) => ec.toLowerCase() === col.key.toLowerCase()
            );
            return { targetColumn: col, sourceColumn: match ?? null };
        });
    }

    proceedToMapping(): void {
        if (!this.uploadedFile || !this.excelColumns.length) return;
        this.completedSteps.add('upload');
        this.currentStep = 'mapping';
    }

    removeFile(): void {
        this.uploadedFile = null;
        this.excelColumns = [];
        this.completedSteps.clear();
        this.currentStep = 'upload';
        this.previewError = null;
        if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    // ── Mapping ─────────────────────────────────────────────────────

    get requiredMappingsDone(): boolean {
        return this.config.columns
            .filter((c) => c.required)
            .every((c) => this.mappings.find((m) => m.targetColumn.key === c.key)?.sourceColumn != null);
    }

    proceedToPreview(): void {
        if (!this.requiredMappingsDone) return;
        this.completedSteps.add('mapping');
        this.currentStep = 'preview';
        this.loadPreview();
    }

    // ── Preview ─────────────────────────────────────────────────────

    /**
     * Builds the mapping payload:
     * { "name": "Product Name", "price": "Price (USD)", ... }
     * (targetKey → excelColumnHeader)
     */
    private buildMappingPayload(): Record<string, string> {
        const map: Record<string, string> = {};
        this.mappings.forEach((m) => {
            if (m.sourceColumn) map[m.targetColumn.key] = m.sourceColumn;
        });
        return map;
    }

    /**
     * Sends the raw Excel file + mapping to previewApi as multipart FormData.
     * API returns PreviewApiResponse.
     */
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<any>([]);
    loadPreview(): void {
        this.isLoadingPreview = true;
        this.previewError = null;
        this.showOnlyErrors = false;
        let result = this.mappings.map(x => ({
            targetColumn: x.targetColumn.key,
            sourceColumn: x.sourceColumn
        }))

        const formData = new FormData();
        formData.append('file', this.uploadedFile!, this.uploadedFile!.name);
        formData.append('mapping', JSON.stringify(result));

        this._service.preview(this.config.previewApi, formData).subscribe({
            next: (res) => {
                debugger
                if (!res || res.length === 0) return;

                // ✅ Clean data (remove \u00A0 etc.)
                const cleanedData = res.map(row => {
                    const newRow: any = {};
                    Object.keys(row).forEach(key => {
                        if (key.toLowerCase() == 'status' || key.toLowerCase() == 'message' || this.config.columns.find(x => x.key.toLowerCase() == key.toLowerCase())) {
                            let value = row[key];

                            if (typeof value === 'string') {
                                value = value.replace(/\u00A0/g, ' ').trim();
                            }

                            newRow[key] = value;
                        }
                    });
                    return newRow;
                });

                // ✅ Dynamically set columns from first row
                this.displayedColumns = Object.keys(cleanedData[0]).filter(x => x != "message");

                this.dataSource.data = cleanedData;
                this.totalRows = res.length;
                this.validCount = res.filter((x: { status: number; }) => x.status == 1).length ?? 0;
                this.invalidCount = res.filter((x: { status: number; }) => x.status != 1).length ?? 0;
                this.isLoadingPreview = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.previewError = err?.error?.message || 'Failed to load preview from server.';
                this.isLoadingPreview = false;
                this.cdr.detectChanges();
            },
        });
    }

    get hasValidationErrors(): boolean {
        return this.invalidCount > 0;
    }

    getColumnLabel(key: string): string {
        return this.config.columns.find((c) => c.key.toLowerCase() === key.toLowerCase())?.label ?? key;
    }

    // ── Import ──────────────────────────────────────────────────────

    /**
     * Sends the same file + mapping to importApi.
     * The API re-reads and saves the data server-side.
     */
    importData(): void {
        this.isImporting = true;
        this.importError = null;
        let result = this.mappings.map(x => ({
            targetColumn: x.targetColumn.key,
            sourceColumn: x.sourceColumn
        }))

        const formData = new FormData();
        formData.append('file', this.uploadedFile!, this.uploadedFile!.name);
        formData.append('mapping', JSON.stringify(result));

        this._service.import(this.config.importApi, formData).subscribe({
            next: () => {
                this.isImporting = false;
                this.importSuccess = true;
                this.completedSteps.add('preview');
                setTimeout(() => this.dialogRef.close({ success: true, count: this.totalRows }), 1800);
            },
            error: (err) => {
                this.isImporting = false;
                this.importError = err?.error?.message || 'Import failed. Please try again.';
                this.cdr.detectChanges();
            },
        });
    }

    close(): void { this.dialogRef.close(null); }
}