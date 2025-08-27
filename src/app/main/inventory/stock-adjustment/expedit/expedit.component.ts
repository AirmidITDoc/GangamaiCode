import { Component, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expedit',
  templateUrl: './expedit.component.html',
  styleUrls: ['./expedit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ExpeditComponent {
  itemname: any;
  oldExpdate: any;
  newExpdate: any;
  Expform: FormGroup;
  registerObj: any;
  vBatchNo:any;
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
      // this.vBatchNo= this.registerObj.batchNo
      // this.itemname = this.registerObj.itemName;
      // this.vBatchNo= this.registerObj.batchNo
      // this.itemname = this.registerObj.itemName;
      this.Expform = this._StockAdjustment.createExpForm()
    }
  }


  onSubmit() {

    let submitData = {
      "batchAdjId": 0,
      "storeId": this.accountService.currentUserValue.user.storeId || 0,
      "itemId": this.registerObj.itemId|| 0,
      "oldBatchNo":  this.registerObj.batchNo || '',
      "oldExpDate": this.datePipe.transform(this.Expform.get('OldexpDate').value, 'yyyy-MM-dd'),
      "newBatchNo":  this.registerObj.batchNo || '',
      "newExpDate": this.Expform.get('NewexpDate').value,
      "addedBy": this.accountService.currentUserValue.userId || 0,
      "stkId": this.registerObj.stockId || 0
    }
    console.log(submitData);
    this._StockAdjustment.BatchAdjSave(submitData).subscribe(response => {
      this._matDialog.closeAll();
      
    });
     
}


vlastDay: string = '';
lastDay2: string = '';
vExpDate: string = '';
calculateLastDay() {
  const inputDate = this.Expform.get("NewexpDate").value;

  const numericPattern = /^[0-9]+$/;
  const CurrentDate = new Date();
  const Currentmonths = new Date();
  const currentMonth = Currentmonths.getMonth();
  console.log(currentMonth)
  const currentYear = CurrentDate.getFullYear();
  console.log(currentYear)
  debugger
  if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
    const month = +inputDate.substring(0, 2);
    const year = +inputDate.substring(2, 6);

    if (year >= currentYear) {
      if (month <= currentMonth && year == currentYear) {
        Swal.fire({
          icon: "warning",
          title: "This item is already expired",
          showConfirmButton: false,
          timer: 1500
        });
        this.vlastDay = '';
        this.Expform.get('NewexpDate').setValue(this.vlastDay)
        return
      }
      if (month > 12 && month <= 0) {
        this.vlastDay = '';
        this.Expform.get('NewexpDate').setValue(this.vlastDay)
        this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      const lastDay = this.getLastDayOfMonth(month, year);
      this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
      this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
      const newuserDate = this.datePipe.transform(this.lastDay2, 'yyyy-MM-dd')
      console.log(newuserDate)
         console.log( this.vlastDay)
      this.Expform.get('NewexpDate').setValue(newuserDate)
      const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
      if (QtyElement) {
        QtyElement.focus();
      }

    } else {
      Swal.fire({
        icon: "warning",
        title: "This item is already expired",
        showConfirmButton: false,
        timer: 1500
      });
      this.vlastDay = '';
      this.Expform.get('NewexpDate').setValue(this.vlastDay)
      return

    }
  } else {
    this.vlastDay = '';
    this.Expform.get('NewexpDate').setValue(this.vlastDay)
    this.toastr.warning('Please enter only numbers in MMYYYY format', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }

}
  private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }
          private getLastDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}
OnReset() {
  this.Expform.reset();
  this._matDialog.closeAll();
}
onClose() {
  this._matDialog.closeAll();
}
}
