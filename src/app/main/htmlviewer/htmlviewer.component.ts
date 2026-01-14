import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HtmlViewerModule } from './htmlviewer.module';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-htmlviewer',
    templateUrl: './htmlviewer.component.html',
    styleUrls: ['./htmlviewer.component.scss'],
    providers: [HtmlViewerModule, MatToolbarModule, MatIconModule]
})
export class HtmlviewerComponent implements OnInit, AfterViewInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<HtmlviewerComponent>) { }
    html: string = "";
    title: string = "";
    qty = 1;

    ngOnInit(): void {
        if (this.data) {
            this.html = this.data.html as string;
            this.title = this.data.title as string;
        }
    }
    @ViewChild('frame') frame!: ElementRef<HTMLIFrameElement>;

    ngAfterViewInit() {
        const doc = this.frame.nativeElement.contentWindow!.document;

        doc.open();
        doc.write(`
    <html>
      <head>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 6px; }
        </style>
      </head>
      <body>
        ${this.html}
      </body>
    </html>
  `);
        doc.close();
    }

    onClose() {
        this.dialogRef.close();
    }


    onPrintThermal() {
        const win = window.open('', '', 'height=800,width=1200');
        let finalPrint = "";
        for (let i = 0; i < this.qty; i++) {
            finalPrint += this.html;
        }
        win!.document.write(`
    <html>
      <head>
        <title>Print</title>
      </head>
      <body>
        ${finalPrint}
      </body>
    </html>
  `);

        win!.document.close();
        win!.focus();
        win!.print();
        win!.close();
    }

    /**
     * Print PDF optimized for thermal printers
     * Opens PDF in iframe and prints with proper settings
     */
    //   onPrintThermal() {
    //     if (!this.html) return;

    //     // Convert base64 to blob
    //     const byteCharacters = atob(this.html);
    //     const byteNumbers = new Array(byteCharacters.length);
    //     for (let i = 0; i < byteCharacters.length; i++) {
    //       byteNumbers[i] = byteCharacters.charCodeAt(i);
    //     }
    //     const byteArray = new Uint8Array(byteNumbers);
    //     const blob = new Blob([byteArray], { type: 'application/pdf' });
    //     const blobUrl = URL.createObjectURL(blob);

    //     // Create hidden iframe for printing with thermal settings
    //     const iframe = document.createElement('iframe');
    //     iframe.style.position = 'fixed';
    //     iframe.style.width = '0';
    //     iframe.style.height = '0';
    //     iframe.style.border = 'none';
    //     iframe.style.left = '-9999px';
    //     iframe.style.top = '-9999px';
    //     iframe.src = blobUrl;

    //     document.body.appendChild(iframe);

    //     iframe.onload = () => {
    //       setTimeout(() => {
    //         try {
    //           iframe.contentWindow?.focus();
    //           iframe.contentWindow?.print();
    //         } catch (e) {
    //           console.error('Print error:', e);
    //           // Fallback: open in new window
    //           window.open(blobUrl, '_blank');
    //         }

    //         // Cleanup after print dialog closes
    //         setTimeout(() => {
    //           document.body.removeChild(iframe);
    //           URL.revokeObjectURL(blobUrl);
    //         }, 1000);
    //       }, 300);
    //     };
    //   }
}
