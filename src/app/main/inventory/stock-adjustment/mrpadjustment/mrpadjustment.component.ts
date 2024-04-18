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
  vNewPurchaseRate:any;
  registerObj:any;
  itemname:any;

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
      this.itemname = this.registerObj.ItemName;
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
  PerUnitMRP:any;
  PurUnitPurchase:any;
  TotalQty:any;
  Qty:any=1;
  TotalAmount:any;
  PerUnitLandedRate:any;
  calculationAmt(){
    if (parseFloat(this.vNewLandedRate) > parseFloat(this.vNewMRP)) {
      this.vNewLandedRate = 0;
      this.toastr.warning('enter landed rate lessthan MRP', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else {
      this.calculateMRP();
    }

    if (parseFloat(this.vNewPurchaseRate) > parseFloat(this.vNewLandedRate)) {
      this.vNewPurchaseRate = 0;
      this.toastr.warning('enter purchase rate lessthan landed rate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    } else {
      this.calculateMRP();
    }     
  }
  calculateMRP(){
    // this.TotalQty = (parseFloat(this.Qty) * parseFloat(this.registerObj.ConversionFactor)).toFixed(2);
    // this.PerUnitLandedRate = parseFloat(this.vNewLandedRate) / parseFloat(this.TotalQty);
    // this.TotalAmount =(parseFloat(this.Qty) * parseFloat(this.PerUnitLandedRate)).toFixed(2);
    // this.PurUnitPurchase = ((parseFloat(this.TotalAmount) / parseFloat(this.TotalQty)));
    // this.PerUnitMRP = (parseFloat(this.vNewMRP) / parseFloat(this.registerObj.ConversionFactor)).toFixed(2);
  }
  Savebtn:boolean=false;
  onSubmit(){
    if (this._StockAdjustment.MRPAdjform.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vNewMRP == '' || this.vNewMRP == null || this.vNewMRP == undefined)) {
      this.toastr.warning('Please enter a New MRP', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vNewLandedRate == '' || this.vNewLandedRate == null || this.vNewLandedRate == undefined)) {
      this.toastr.warning('Please enter a New LandedRate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vNewPurchaseRate == '' || this.vNewPurchaseRate == null || this.vNewPurchaseRate == undefined)) {
      this.toastr.warning('Please enter a New PurchaseRate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
  this.Savebtn = true;
  let insertMRPAdju = {};
  insertMRPAdju['storeId'] = this._loggedService.currentUserValue.user.storeId || 0;
  insertMRPAdju['itemId'] = this. registerObj.ItemId || 0;
  insertMRPAdju['batchNo'] =  this. registerObj.BatchNo || '';
  insertMRPAdju['oldMrp'] = this._StockAdjustment.MRPAdjform.get('OldMRP').value || 0;
  insertMRPAdju['oldLandedRate'] = this._StockAdjustment.MRPAdjform.get('LandedRate').value || 0;
  insertMRPAdju['oldPurRate'] = this._StockAdjustment.MRPAdjform.get('PurchaseRate').value || 0;
  insertMRPAdju['qty'] = 0;
  insertMRPAdju['mrp'] = this._StockAdjustment.MRPAdjform.get('NewMRP').value ||  0;
  insertMRPAdju['landedRate'] = this._StockAdjustment.MRPAdjform.get('newLandedRate').value ||  0;
  insertMRPAdju['purRate'] = this._StockAdjustment.MRPAdjform.get('NewPurchaseRate').value || 0;
  insertMRPAdju['addedBy'] = this._loggedService.currentUserValue.user.id || 0;
  insertMRPAdju['addedDateTime'] = new Date();

  let insertMRPAdjuNew = {};
  insertMRPAdjuNew['storeId'] = this._loggedService.currentUserValue.user.storeId || 0;
  insertMRPAdjuNew['stockid'] = this. registerObj.StockId || 0;
  insertMRPAdjuNew['itemId'] = this. registerObj.ItemId || 0;
  insertMRPAdjuNew['batchNo'] =  this. registerObj.BatchNo || '';
  insertMRPAdjuNew['perUnitMrp'] =  this._StockAdjustment.MRPAdjform.get('NewMRP').value ||  0;
  insertMRPAdjuNew['perUnitPurrate'] = this._StockAdjustment.MRPAdjform.get('newLandedRate').value ||  0;
  insertMRPAdjuNew['perUnitLanedrate'] = this._StockAdjustment.MRPAdjform.get('NewPurchaseRate').value || 0;
  insertMRPAdjuNew['oldUnitMrp'] = this._StockAdjustment.MRPAdjform.get('OldMRP').value ||  0;
  insertMRPAdjuNew['oldUnitPur'] = this._StockAdjustment.MRPAdjform.get('PurchaseRate').value ||  0;
  insertMRPAdjuNew['oldUnitLanded'] = this._StockAdjustment.MRPAdjform.get('LandedRate').value || 0;


  let submitData = {
    "insertMRPAdju": insertMRPAdju,
    "insertMRPAdjuNew" :insertMRPAdjuNew
  };
  console.log(submitData);
  this._StockAdjustment.MRPAdjSave(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); this._matDialog.closeAll();
      this.Savebtn = false;
    }
    else {
      this.toastr.error('MRP Adjustment Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }

  }, error => {
    this.toastr.error('MRP Adjustment Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });
  }
  OnReset(){
    this._StockAdjustment.MRPAdjform.reset(); 
    this._matDialog.closeAll();
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
