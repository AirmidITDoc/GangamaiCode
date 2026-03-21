import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from './pdfviewer.module';

@Component({
    selector: 'app-pdfviewer',
    templateUrl: './pdfviewer.component.html',
    styleUrls: ['./pdfviewer.component.scss'],
    providers: [NgxExtendedPdfViewerModule, PdfViewerModule, MatToolbarModule]
})
export class PdfviewerComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PdfviewerComponent>,) { }
    base64: string = "";
    title: string = "";

    ngOnInit(): void {
        if (this.data) {
            this.base64 = this.data.base64 as string;
            this.title = this.data.title as string;
            console.log(this.data);
            console.log(this.title);
        }
    }

    onClose() {
        this.dialogRef.close();
    }

    /**
     * Print PDF optimized for thermal printers
     * Opens PDF in iframe and prints with proper settings
     */
    onPrintThermal() {
        if (!this.base64) return;

        // Convert base64 to blob
        const byteCharacters = atob(this.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        // Create hidden iframe for printing with thermal settings
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.src = blobUrl;

        document.body.appendChild(iframe);

        iframe.onload = () => {
            setTimeout(() => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error('Print error:', e);
                    // Fallback: open in new window
                    window.open(blobUrl, '_blank');
                }

                // Cleanup after print dialog closes
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(blobUrl);
                }, 1000);
            }, 300);
        };
    }
}
