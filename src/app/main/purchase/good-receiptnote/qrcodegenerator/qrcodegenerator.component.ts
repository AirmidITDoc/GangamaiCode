import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-qrcodegenerator',
  templateUrl: './qrcodegenerator.component.html',
  styleUrls: ['./qrcodegenerator.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class QrcodegeneratorComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QrcodegeneratorComponent>, private _formBuilder: UntypedFormBuilder) {
  }
  Width=100;
  QrData={};
  Title="QR Code Print";
  ngOnInit(): void {
    if (this.data) {
      this.QrData = this.data.QrData;
      this.Title=this.data.title;
    }
  }
  onClose() {
    this.dialogRef.close();
  }
}
