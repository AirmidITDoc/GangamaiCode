import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentFileModel } from 'app/core/models/documentmanagement/document.model';
import { ZipService } from 'app/main/documentmanagement/zip.service';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss'],
})
export class PreviewDialogComponent {
  mockLines = [92, 68, 80, 45, 88, 72, 60, 84, 40];

  constructor(
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    private zipService: ZipService,
    @Inject(MAT_DIALOG_DATA) public doc: DocumentFileModel
  ) {}

  get previewText(): string {
    return this.zipService.buildPlaceholderContent(this.doc);
  }

  download(): void {
    this.zipService.downloadSingleDocument(this.doc);
  }

  close(): void {
    this.dialogRef.close();
  }
}
