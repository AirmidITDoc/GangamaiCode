import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { mergeFilesIntoTree, PatientFile, TreeNode } from 'app/core/models/documentmanagement/category.model';
import { DocumentmanagementService } from 'app/main/documentmanagement/documentmanagement.service';
import { forkJoin } from 'rxjs';
// TODO: import the service you ALREADY use to load the category tree
// import { CategoryService } from 'app/core/services/documentmanagement/category.service';

@Component({
    selector: 'app-patient-documents',
    templateUrl: './patient-documents.component.html',
    styleUrls: ['./patient-documents.component.scss'],
})
export class PatientDocumentsComponent implements OnChanges {
    @Input() patientId!: number;
    @Input() showViewer = true;
    @Input() selectedFileId: number | null = null;

    @Output() uploadDocument = new EventEmitter<number>();
    @Output() viewDocuments = new EventEmitter<number>();
    @Output() generateQrCode = new EventEmitter<number>();
    @Output() fileSelected = new EventEmitter<PatientFile | null>();

    @HostBinding('class.tree-only')
    get treeOnly(): boolean {
        return !this.showViewer;
    }

    treeNodes: TreeNode[] = [];
    selectedFile: PatientFile | null = null;
    loading = false;

    constructor(
        private docs: DocumentmanagementService, // <- your existing service that has getFilesByPatient()
        // private categories: CategoryService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['patientId'] && this.patientId != null) this.reload();
    }

    reload(): void {
        this.loading = true;
        forkJoin({
            // TODO: replace with your existing category API call
            categories: this.docs.getCategoryTree(0),
            files: this.docs.getAdmissionDocuments(this.patientId, 0),
        }).subscribe({
            next: ({ categories, files }) => {
                this.treeNodes = mergeFilesIntoTree(categories, files);
                // keep selection only if that file still exists
                if (this.selectedFile && !files.some((f) => f.id === this.selectedFile!.id)) {
                    this.selectedFile = null;
                    this.fileSelected.emit(null);
                }
                this.loading = false;
            },
            error: () => (this.loading = false),
        });
    }

    onSelectFile(file: PatientFile): void {
        this.selectedFile = file;
        this.fileSelected.emit(file);
    }

    private getCategories() {
        // return this.categories.getCategoryTree();   // <- your existing call
        throw new Error('Wire getCategories() to your existing category API');
    }
}
