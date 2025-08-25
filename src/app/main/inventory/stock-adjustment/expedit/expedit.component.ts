import { Component, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-expedit',
  templateUrl: './expedit.component.html',
  styleUrls: ['./expedit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ExpeditComponent {
itemname:any;
oldExpdate:any;
newExpdate:any;
Expform:FormGroup;
  registerObj: any;
  constructor(
      public _StockAdjustment: StockAdjustmentService,
      private accountService: AuthenticationService,
      public datePipe: DatePipe,
      public dialogRef: MatDialogRef<ExpeditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public _matDialog: MatDialog,
      public toastr: ToastrService,
      private elementRef: ElementRef,
    ) { }
  
    ngOnInit(): void {
      if (this.data.Obj) {
        this.registerObj = this.data.Obj;
        console.log(this.registerObj)
        this.oldExpdate = this.registerObj.batchExpDate;
        
      this.itemname = this.registerObj.itemName;

      this.Expform=this._StockAdjustment.createExpForm()
      }} 
      

      onSubmit() {
   
    let submitData = {
      "storeId": this.accountService.currentUserValue.user.storeId || 0,
      "stkId": this.registerObj.stockId || 0,
      "itemId": this.registerObj.itemId || 0,
      "batchNo": this.registerObj.batchNo || '',
      "oldCgstper": this._StockAdjustment.GSTAdjustment.get('CGSTPer').value || 0,
      "oldSgstper": this._StockAdjustment.GSTAdjustment.get('SGSTPer').value || 0,
      "oldIgstper": this._StockAdjustment.GSTAdjustment.get('IGSTPer').value || 0,
      "cgstper": this._StockAdjustment.GSTAdjustment.get('NewCGSTPer').value || 0,
      "sgstper": this._StockAdjustment.GSTAdjustment.get('NewSGSTPer').value || 0,
      "igstper": this._StockAdjustment.GSTAdjustment.get('NewIGSTPer').value || 0,
      "addedBy": this.accountService.currentUserValue.user.storeId  || 0
    };
    console.log(submitData);
    this._StockAdjustment.GSTAdjSave(submitData).subscribe(response => {
    this._matDialog.closeAll();

    });
  }
  OnReset() {
    this.Expform.reset();
    this._matDialog.closeAll();
  }
  onClose() {
    this._matDialog.closeAll();
  }
}
    