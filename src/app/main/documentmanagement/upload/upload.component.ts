import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileKind, DocumentFileModel } from 'app/core/models/documentmanagement/document.model';
import { DocumentCategory } from 'app/core/models/documentmanagement/category.model';
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
    registrations: any[] = [];
    selectedPatient: Patient | null = null;
    selectedRegistration: any | null = null;
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

    constructor(private snackBar: MatSnackBar, private _service: DocumentmanagementService) {
        this.bindCategories();
    }
    bindCategories() {
        this._service.getCategoryTree().subscribe((res) => {
            this.categories = res;
        })
    }

    /* ---------------- Step 1 ---------------- */
    searchPatients(): void {
        this._service.searchPatient(this.patientQuery).subscribe((res) => {
            this.patientResults = res;
        });
    }
    getAdmissions(): void {
        if (this.selectedPatient) {
            this._service.getAdmissions(this.selectedPatient.id).subscribe((res) => {
                debugger;
                this.registrations = res;
            });
        }
    }
    pickRegistration(r: any): void {
        this.selectedRegistration = r;
    }

    pickPatient(p: Patient): void {
        this.selectedPatient = p;
        this.patientResults = [];
        this.patientQuery = '';
        this.getAdmissions();
    }

    clearPatient(): void {
        this.selectedPatient = null;
        this.selectedRegistration = null;
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
        const data: DocumentFileModel[] = [];
        if (!this.selectedPatient || !this.selectedCategoryId || !this.staged.length) return;
        this.staged.forEach((s) => {
            const doc: DocumentFileModel = {
                id: 0,
                admissionId: this.selectedRegistration?.admissionId || 0,
                docCatId: this.selectedCategoryId!,
                document: s.file,
                orgFileName: s.title || s.file.name,
                savedFileName: s.file.name,
                fileTags: s.tagsInput,
                createdBy: 0,
                createdDate: undefined,
                docNo: '',
                fileKind: this.detectKind(s.file.name),
                fileSize: s.file.size
            };
            data.push(doc);
        });
        this._service.saveDocument(data).subscribe((res) => {
            this.lastSubmittedCount = this.staged.length;
            this.submitted = true;
            this.snackBar.open(`${this.lastSubmittedCount} document(s) uploaded successfully`, 'Dismiss', { duration: 3000 });
        });
    }

    startOver(): void {
        this.selectedPatient = null;
        this.selectedRegistration = null;
        this.selectedCategoryId = null;
        this.staged = [];
        this.submitted = false;
        this.stepper?.reset();
    }
}
