import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PatientFile } from 'app/core/models/documentmanagement/category.model';
import { DocumentmanagementService } from 'app/main/documentmanagement/documentmanagement.service';
import { Subscription } from 'rxjs';

type ViewKind = 'pdf' | 'image' | 'unsupported';

@Component({
    selector: 'app-document-viewer',
    templateUrl: './document-viewer.component.html',
    styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent implements OnChanges, OnDestroy {
    @Input() file: PatientFile | null = null;

    loading = false;
    error = false;
    kind: ViewKind = 'unsupported';
    safeUrl: SafeResourceUrl | null = null;

    private objectUrl: string | null = null;
    private blob: Blob | null = null;
    private sub?: Subscription;

    constructor(private docs: DocumentmanagementService, private sanitizer: DomSanitizer) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['file']) this.load();
    }

    ngOnDestroy(): void {
        this.cleanup();
    }

    download(): void {
        if (!this.blob || !this.file) return;
        const url = URL.createObjectURL(this.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.file.savedFileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    private load(): void {
        debugger
        this.cleanup();
        if (!this.file) return;

        this.kind = this.detectKind(this.file);
        this.loading = true;
        this.error = false;

        this.sub = this.docs.getFileBlob(this.file.savedFileName).subscribe({
            next: (blob) => {
                this.blob = blob;
                if (this.kind !== 'unsupported') {
                    // Force the right mime type so the browser renders instead of downloads
                    const typed = new Blob([blob], { type: this.mimeFor(this.kind, blob.type) });
                    this.objectUrl = URL.createObjectURL(typed);
                    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
                }
                this.loading = false;
            },
            error: () => {
                this.error = true;
                this.loading = false;
            },
        });
    }

    private cleanup(): void {
        this.sub?.unsubscribe();
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
        this.safeUrl = null;
        this.blob = null;
        this.error = false;
        this.loading = false;
    }

    private detectKind(f: PatientFile): ViewKind {
        const name = (f.savedFileName || '').toLowerCase();
        const type = (f.fileKind || '').toLowerCase();
        if (type.includes('pdf') || name.endsWith('.pdf')) return 'pdf';
        if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) return 'image';
        return 'unsupported';
    }

    private mimeFor(kind: ViewKind, fallback: string): string {
        if (kind === 'pdf') return 'application/pdf';
        return this.file?.fileKind || fallback || 'image/*';
    }
}
