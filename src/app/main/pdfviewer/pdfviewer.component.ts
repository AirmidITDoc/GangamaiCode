import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  MatToolbarModule } from '@angular/material/toolbar';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from './pdfviewer.module';

@Component({
  selector: 'app-pdfviewer',
  templateUrl: './pdfviewer.component.html',
  styleUrls: ['./pdfviewer.component.scss'],
  providers: [NgxExtendedPdfViewerModule, PdfViewerModule,MatToolbarModule]
})
export class PdfviewerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<PdfviewerComponent>,) { }
  base64: string = "";
  title: string = "";
  ngOnInit(): void {
    if (this.data) {
      this.base64 = this.data.base64 as string;
      // console.log(this.base64);
      this.title = this.data.title as string;
      console.log(this.data);
    }
  }
  onClose() {
    this.dialogRef.close();
  }

}
