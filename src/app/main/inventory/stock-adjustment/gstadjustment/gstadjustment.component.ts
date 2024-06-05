import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-gstadjustment',
  templateUrl: './gstadjustment.component.html',
  styleUrls: ['./gstadjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GSTAdjustmentComponent implements OnInit {

  dateTimeObj:any;
  vCGSTPer:any;
  vSGSTPer:any;
  vIGSTPer:any; 
  vNewCGSTPer:any;
  vNewSGSTPer:any;
  vNewIGSTPer:any;
  vTotalGSTPer:any;
  registerObj:any;
  itemname:any;
  vOldTotalGSTPer:any;

  constructor(
    public _StockAdjustment: StockAdjustmentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<GSTAdjustmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vCGSTPer = this.registerObj.CGSTPer;
      this.vSGSTPer = this.registerObj.SGSTPer;
      this.vIGSTPer = this.registerObj.IGSTPer;
      this.itemname = this.registerObj.ItemName;
      this.calculationOldGst(this.registerObj)
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
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  calculationAmt(){
    debugger
    let CGSTPer = (this.vNewCGSTPer) || 0;
    let SGSTPer = (this.vNewSGSTPer) || 0;
    let IGSTPer = (this.vNewIGSTPer) || 0;
    this.vTotalGSTPer = (parseFloat(CGSTPer) + parseFloat(SGSTPer) + parseFloat(IGSTPer)).toFixed(2);
  }
  calculationOldGst(obj){  
    this.vOldTotalGSTPer = (parseFloat(obj.CGSTPer) + parseFloat(obj.SGSTPer) + parseFloat(obj.IGSTPer)).toFixed(2);
  }
 
  Savebtn:boolean=false;
  onSubmit(){
    // if (this._StockAdjustment.GSTAdjustment.invalid) {
    //   this.toastr.warning('please check from is invalid', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if ((this.vNewSGSTPer == '' || this.vNewSGSTPer == null || this.vNewSGSTPer == undefined)) {
      this.toastr.warning('Please enter a New CGST', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vNewIGSTPer == '' || this.vNewIGSTPer == null || this.vNewIGSTPer == undefined)) {
      this.toastr.warning('Please enter a New SGST', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vIGSTPer == null || this.vIGSTPer == undefined)) {
      this.toastr.warning('Please enter a New IGST', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
 
  this.Savebtn = true;
  let insertGSTAdju = {};
  insertGSTAdju['storeId'] = this._loggedService.currentUserValue.user.storeId || 0;
  insertGSTAdju['itemId'] = this. registerObj.ItemId || 0;
  insertGSTAdju['stkId'] =this. registerObj.StockId || 0;
  insertGSTAdju['batchNo'] =  this. registerObj.BatchNo || '';
  insertGSTAdju['oldCGSTPer'] = this._StockAdjustment.GSTAdjustment.get('CGSTPer').value || 0;
  insertGSTAdju['oldSGSTPer'] = this._StockAdjustment.GSTAdjustment.get('SGSTPer').value || 0;
  insertGSTAdju['oldIGSTPer'] = this._StockAdjustment.GSTAdjustment.get('IGSTPer').value || 0;
  insertGSTAdju['cgstPer'] = this._StockAdjustment.GSTAdjustment.get('NewCGSTPer').value ||  0;
  insertGSTAdju['sgstPer'] = this._StockAdjustment.GSTAdjustment.get('NewSGSTPer').value ||  0;
  insertGSTAdju['igstPer'] = this._StockAdjustment.GSTAdjustment.get('NewIGSTPer').value || 0;
  insertGSTAdju['addedBy'] = this._loggedService.currentUserValue.user.id || 0;  

  let submitData = {
    "gstAdjustment": insertGSTAdju 
  };
  console.log(submitData);
  this._StockAdjustment.GSTAdjSave(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('GST Adjustment Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); this._matDialog.closeAll();
      this.Savebtn = false;
    }
    else {
      this.toastr.error('GST Adjustment Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }

  }, error => {
    this.toastr.error('GST Adjustment Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });
  }
  OnReset(){
    this._StockAdjustment.GSTAdjustment.reset(); 
    this._matDialog.closeAll();
  }
  onClose(){
    this._matDialog.closeAll();
  }
}