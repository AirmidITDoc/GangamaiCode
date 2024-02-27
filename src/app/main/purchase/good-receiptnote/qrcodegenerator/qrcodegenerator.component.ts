import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  qrCodeForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QrcodegeneratorComponent>, private _formBuilder: FormBuilder) {
    this.qrCodeForm = this.getQrForm();
  }
  qtys = [1, 2, 3, 4, 5];
  Width=100;
  Height=100;
  Qty=1;
  QrCode="";
  ngOnInit(): void {
    debugger
    if (this.data) {
      this.QrCode = this.data.QrCodeData.toString();
    }
  }
  OnPrint() {
    debugger
    const printContents = document.getElementById("dvPrint").innerHTML;
    const pageContent = `<!DOCTYPE html><html><head></head><body onload="window.print()">${printContents}</html>`;
    let popupWindow: Window;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      popupWindow = window.open(
        '',
        '_blank',
        'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
      );
      popupWindow.window.focus();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
      popupWindow.onbeforeunload = event => {
        popupWindow.close();
      };
      popupWindow.onabort = event => {
        popupWindow.document.close();
        popupWindow.close();
      };
    } else {
      popupWindow = window.open('', '_blank', 'width=600,height=600');
      popupWindow.document.open();
      popupWindow.document.write(pageContent);
      popupWindow.document.close();
    }

  }

  onClose() {
    this.dialogRef.close();
  }
  getQrForm() {
    return this._formBuilder.group({
      Qty: [''],
      Width: [''],
      Height: ['']
    });
  }
}
