import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-excel-preview-dialog',
  templateUrl: './excel-preview-dialog.component.html',
  styleUrls: ['./excel-preview-dialog.component.scss'],
  animations: fuseAnimations
})
export class ExcelPreviewDialogComponent implements OnInit, OnDestroy {
  constructor(public dialogRef: MatDialogRef<ExcelPreviewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { sheetName: string; data: any[] }) {}

  ngOnInit(): void {
    console.log("Data: ", this.data);
  }

  displayedColumns(): string[] {
    return this.data.data.length > 0 ? Object.keys(this.data.data[0]) : [];
  }
  onReset():void{
    this.dialogRef.close();
  }
  ngOnDestroy(): void {}
  
}
