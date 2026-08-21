import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileKind, HospitalDocument } from 'app/core/models/documentmanagement/document.model';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';
import { MockDataService } from '../mock-data.service';
import { Patient } from 'app/core/models/documentmanagement/patient.model';
import { DocumentmanagementService } from '../documentmanagement.service';

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

    categories: DocumentCategory[] = [];

    /* Step 1 — patient */
    patientQuery = '';
    patientResults: Patient[] = [];
    selectedPatient: Patient | null = null;
    showNewPatientForm = false;
    newPatient: Partial<Patient> = { gender: 'Female' };

    /* Step 2 — category */
    selectedCategoryId: number | null = null;

    /* Step 3 — files */
    staged: StagedFile[] = [];
    isDragging = false;

    /* Step 4 */
    submitted = false;
    lastSubmittedCount = 0;

    constructor(private data: MockDataService, private snackBar: MatSnackBar, private _service: DocumentmanagementService) {
        this.bindCategories();
    }
    bindCategories() {
        this._service.getCategoryTree().subscribe((res) => {
            this.categories = res;
        })
    }

    /* ---------------- Step 1 ---------------- */
    searchPatients(): void {
        this._service.seachPatient(this.patientQuery).subscribe((res) => {
            this.patientResults = res;
        });
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
    onCategorySelect(id: number): void {
        this.selectedCategoryId = id;
    }

    get selectedCategoryPath(): string[] {
        if (!this.selectedCategoryId) return [];
        const match = this.getAllPaths().find((p) => p.id === this.selectedCategoryId);
        return match ? match.path : [];
    }
    /** Returns every root-to-leaf path in the tree, useful for pickers / breadcrumbs */
    getAllPaths(): { id: number; path: string[]; icon?: string }[] {
        const out: { id: number; path: string[]; icon?: string }[] = [];
        const walk = (nodes: DocumentCategory[], trail: string[]) => {
            for (const n of nodes) {
                const newTrail = [...trail, n.docCategory];
                out.push({ id: n.id, path: newTrail, icon: n.icon });
                if (n.children.length) walk(n.children, newTrail);
            }
        };
        walk(this.categories, []);
        return out;
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
                id: '0',
                title: s.title || s.file.name,
                fileName: s.file.name,
                fileKind: s.kind,
                fileSizeKb: Math.max(1, Math.round(s.file.size / 1024)),
                categoryPath: path,
                categoryId: this.selectedCategoryId!.toString(),
                patientName: this.selectedPatient!.firstName,
                uploadedBy: 'Front Desk — S. Kulkarni',
                uploadedOn: new Date().toISOString(),
                tags: s.tagsInput
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                thumbnailColor: '#0E7C7B',
                patientId: 0
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
