import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mrpadjustment',
  templateUrl: './mrpadjustment.component.html',
  styleUrls: ['./mrpadjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MRPAdjustmentComponent implements OnInit {

  dateTimeObj:any;
  vOldMRP:any;
  vLandedRate:any;
  vPurchaseRate:any;
  vConversionFactor:any;
  vNewMRP:any;
  vNewLandedRate:any;
  vNewPurchaseRatee:any;
  registerObj:any;

  constructor(
    public _StockAdjustment: StockAdjustmentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<MRPAdjustmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vOldMRP = this.registerObj.UnitMRP;
      this.vLandedRate = this.registerObj.LandedRate;
      this.vPurchaseRate = this.registerObj.PurUnitRateWF;
     // this.vConversionFactor = this.registerObj.LandedRate
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  focusNext(nextElementId: string): void {
    const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }
  Savebtn:boolean=false;
  onSubmit(){
  
  this.Savebtn = true;
  let customerInvoiceRaiseInsert = {};
  customerInvoiceRaiseInsert['invNumber'] = this._StockAdjustment.MRPAdjform.get('InvoiceNo').value || 0;
  customerInvoiceRaiseInsert['invDate'] = this._StockAdjustment.MRPAdjform.get('InvoiceDate').value || '';
  customerInvoiceRaiseInsert['customerId'] = this._StockAdjustment.MRPAdjform.get('CustomerId').value || '';
  customerInvoiceRaiseInsert['amount'] = this._StockAdjustment.MRPAdjform.get('Amount').value || 0;
  customerInvoiceRaiseInsert['invoiceRaisedId'] = this._StockAdjustment.MRPAdjform.get('InvoiceRaisedId').value;
  customerInvoiceRaiseInsert['createdBy'] = this._loggedService.currentUserValue.user.id || 0;


  let submitData = {
    "customerInvoiceRaiseInsert": customerInvoiceRaiseInsert,
  };
  console.log(submitData);
  // this._StockAdjustment.SaveCustomerBill(submitData).subscribe(response => {
  //   if (response) {
  //     this.toastr.success('Record Saved Successfully.', 'Saved !', {
  //       toastClass: 'tostr-tost custom-toast-success',
  //     }); this._matDialog.closeAll();
  //     this.Savebtn = false;
  //   }
  //   else {
  //     this.toastr.error('New Custome Data not saved !, Please check API error..', 'Error !', {
  //       toastClass: 'tostr-tost custom-toast-error',
  //     });
  //   }

  // }, error => {
  //   this.toastr.error('New Custome Data not saved !, Please check API error..', 'Error !', {
  //     toastClass: 'tostr-tost custom-toast-error',
  //   });
  // });
  }
  onReset(){
    this._StockAdjustment.MRPAdjform.reset(); 
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
