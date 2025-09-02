import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { FormGroup, FormGroupName, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-mrpadjustment',
  templateUrl: './mrpadjustment.component.html',
  styleUrls: ['./mrpadjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MRPAdjustmentComponent implements OnInit {

  dateTimeObj: any;
  vOldMRP: any;
  vLandedRate: any;
  vPurchaseRate: any;
  vConversionFactor: any;
  vNewMRP: any;
  vNewLandedRate: any;
  vNewPurchaseRate: any;
  registerObj: any;
  itemname: any;

  PerUnitMRP: any;
  PurUnitPurchase: any;
  TotalQty: any;
  Qty: any = 1;
  TotalAmount: any;
  PerUnitLandedRate: any;
  mrpform: FormGroup;
  MRPAdjform: FormGroup;
  constructor(
    public _StockAdjustment: StockAdjustmentService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<MRPAdjustmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private elementRef: ElementRef,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.MRPAdjform = this._StockAdjustment.createMRPAdjForm()
    this.mrpform = this.createmrpform();
    this.MRPAdjform.markAllAsTouched();

    if (this.data.Obj) {
      debugger
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vOldMRP = this.registerObj.unitMRP;
      this.vLandedRate = this.registerObj.landedRate;
      this.vPurchaseRate = this.registerObj.purUnitRateWF;
      this.itemname = this.registerObj.itemName;

    }

    this.MRPAdjform.get('OldMRP').setValue(this.registerObj.unitMRP)
    this.MRPAdjform.get('LandedRate').setValue(this.registerObj.landedRate)
    this.MRPAdjform.get('PurchaseRate').setValue(this.registerObj.purUnitRateWF)

  }


  createMRPAdjForm() {
    return this._formBuilder.group({
      OldMRP: [0, [Validators.min(0)]],
      LandedRate: [0, [Validators.min(0)]],
      PurchaseRate: [0, [Validators.min(0)]],
      ConversionFactor: [0, [Validators.min(0)]],
      NewMRP: [0, [Validators.required, Validators.min(0)]],
      newLandedRate: [0, [Validators.required, Validators.min(0)]],
      NewPurchaseRate: [0, [Validators.required, Validators.min(0)]],
      // AddedDate:[new Date()],
    });
  }


  createmrpform() {
    return this._formBuilder.group({
      "mrpAdjustmentMod": this._formBuilder.group({
        "storeId": [this.accountService.currentUserValue.user.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "itemId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "batchNo": [''],
        "oldMrp": [this.vOldMRP],
        "oldPurRate": [this.vPurchaseRate],
        "oldLandedRate": [this.vLandedRate],
        "qty": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "mrp": [this.vNewMRP],
        "landedRate": [this.vNewLandedRate],
        "purRate": [this.vNewPurchaseRate],
        "addedBy": [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "addedDateTim": [(new Date()).toISOString().split('T')[0]],

      }),
      "curruntStockModel": this._formBuilder.group({
        "storeId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "stockId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "itemId": [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        "batchNo": [''],
        "unitMrp": [0],
        "purchaserate": [0],
        "landedRate": [0],
        "oldUnitMrp": [this.vOldMRP],
        "oldUnitPur": [this.vPurchaseRate],
        "oldUnitLanded": [this.vLandedRate]

      })
    });
  }

  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  // focusNext(nextElementId: string): void {
  //   const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
  //   if (nextElement) {
  //     nextElement.focus();
  //   }
  // }

  calculationAmt() {
    debugger

    this.vNewLandedRate = this.MRPAdjform.get('newLandedRate').value
    this.vNewMRP = this.MRPAdjform.get('NewMRP').value
    this.vNewPurchaseRate = this.MRPAdjform.get('NewPurchaseRate').value


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
  calculateMRP() {
    // this.TotalQty = (parseFloat(this.Qty) * parseFloat(this.registerObj.ConversionFactor)).toFixed(2);
    // this.PerUnitLandedRate = parseFloat(this.vNewLandedRate) / parseFloat(this.TotalQty);
    // this.TotalAmount =(parseFloat(this.Qty) * parseFloat(this.PerUnitLandedRate)).toFixed(2);
    // this.PurUnitPurchase = ((parseFloat(this.TotalAmount) / parseFloat(this.TotalQty)));
    // this.PerUnitMRP = (parseFloat(this.vNewMRP) / parseFloat(this.registerObj.ConversionFactor)).toFixed(2);
  }
  Savebtn: boolean = false;
  // onSubmit1() {
  //   if (this.MRPAdjform.invalid) {
  //     this.toastr.warning('please check from is invalid', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  //   if ((this.vNewMRP == '' || this.vNewMRP == null || this.vNewMRP == undefined)) {
  //     this.toastr.warning('Please enter a New MRP', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  //   if ((this.vNewLandedRate == '' || this.vNewLandedRate == null || this.vNewLandedRate == undefined)) {
  //     this.toastr.warning('Please enter a New LandedRate', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  //   if ((this.vNewPurchaseRate == '' || this.vNewPurchaseRate == null || this.vNewPurchaseRate == undefined)) {
  //     this.toastr.warning('Please enter a New PurchaseRate', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }

  //   this.Savebtn = true;
  //   let insertMRPAdju = {};
  //   insertMRPAdju['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
  //   insertMRPAdju['itemId'] = this.registerObj.itemId || 0;
  //   insertMRPAdju['batchNo'] = this.registerObj.batchNo || '';
  //   insertMRPAdju['oldMrp'] = this.MRPAdjform.get('OldMRP').value || 0;
  //   insertMRPAdju['oldLandedRate'] = this.MRPAdjform.get('LandedRate').value || 0;
  //   insertMRPAdju['oldPurRate'] = this.MRPAdjform.get('PurchaseRate').value || 0;
  //   insertMRPAdju['qty'] = 0;
  //   insertMRPAdju['mrp'] = this.MRPAdjform.get('NewMRP').value || 0;
  //   insertMRPAdju['landedRate'] = this.MRPAdjform.get('newLandedRate').value || 0;
  //   insertMRPAdju['purRate'] = this.MRPAdjform.get('NewPurchaseRate').value || 0;
  //   insertMRPAdju['addedBy'] = this.accountService.currentUserValue.user.storeId || 0;
  //   insertMRPAdju['addedDateTime'] = new Date();

  //   let insertMRPAdjuNew = {};
  //   insertMRPAdjuNew['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
  //   insertMRPAdjuNew['stockid'] = this.registerObj.stockId || 0;
  //   insertMRPAdjuNew['itemId'] = this.registerObj.itemId || 0;
  //   insertMRPAdjuNew['batchNo'] = this.registerObj.batchNo || '';
  //   insertMRPAdjuNew['unitMrp'] = this.MRPAdjform.get('NewMRP').value || 0;
  //   insertMRPAdjuNew['purchaserate'] = this.MRPAdjform.get('newLandedRate').value || 0;
  //   insertMRPAdjuNew['landedRate'] = this.MRPAdjform.get('NewPurchaseRate').value || 0;
  //   insertMRPAdjuNew['oldUnitMrp'] = this.MRPAdjform.get('OldMRP').value || 0;
  //   insertMRPAdjuNew['oldUnitPur'] = this.MRPAdjform.get('PurchaseRate').value || 0;
  //   insertMRPAdjuNew['oldUnitLanded'] = this.MRPAdjform.get('LandedRate').value || 0;


  //   let submitData = {
  //     "mrpAdjustmentMod": insertMRPAdju,
  //     "curruntStockModel": insertMRPAdjuNew
  //   };
  //   console.log(submitData);
  //   this._StockAdjustment.MRPAdjSave(submitData).subscribe(response => {
  //     this._matDialog.closeAll();
  //     this.Savebtn = false;
  //   });
  // }

  onSubmit() {
    console.log(this.MRPAdjform.value)
    debugger
    // this.Savebtn = true;
    if (!this.MRPAdjform.invalid) {

      this.mrpform.get('mrpAdjustmentMod.storeId').setValue(this.accountService.currentUserValue.user.storeId || 0)
      this.mrpform.get('mrpAdjustmentMod.itemId').setValue(this.registerObj.itemId || 0)
      this.mrpform.get('mrpAdjustmentMod.batchNo').setValue(this.registerObj.batchNo || '')
      this.mrpform.get('mrpAdjustmentMod.oldMrp').setValue(this.vOldMRP || 0)
      this.mrpform.get('mrpAdjustmentMod.oldLandedRate').setValue(this.vLandedRate || 0)
      this.mrpform.get('mrpAdjustmentMod.oldPurRate').setValue(this.vPurchaseRate || 0)
      this.mrpform.get('mrpAdjustmentMod.qty').setValue(0)
      this.mrpform.get('mrpAdjustmentMod.mrp').setValue(this.MRPAdjform.get('NewMRP').value || 0)
      this.mrpform.get('mrpAdjustmentMod.landedRate').setValue(this.MRPAdjform.get('newLandedRate').value || 0)
      this.mrpform.get('mrpAdjustmentMod.purRate').setValue(this.MRPAdjform.get('NewPurchaseRate').value || 0)
      this.mrpform.get('mrpAdjustmentMod.addedBy').setValue(this.accountService.currentUserValue.userId)
      this.mrpform.get('mrpAdjustmentMod.addedDateTim').setValue(new Date())

      this.mrpform.get('curruntStockModel.storeId').setValue(this.accountService.currentUserValue.user.storeId || 0)
      this.mrpform.get('curruntStockModel.stockId').setValue(this.registerObj.stockId || 0)
      this.mrpform.get('curruntStockModel.itemId').setValue(this.registerObj.itemId || '')
      this.mrpform.get('curruntStockModel.batchNo').setValue(this.registerObj.batchNo || '')
      this.mrpform.get('curruntStockModel.unitMrp').setValue(this.MRPAdjform.get('NewMRP').value || 0)
      this.mrpform.get('curruntStockModel.purchaserate').setValue(this.MRPAdjform.get('NewPurchaseRate').value || 0)
      this.mrpform.get('curruntStockModel.landedRate').setValue(this.MRPAdjform.get('newLandedRate').value || 0)
      this.mrpform.get('curruntStockModel.oldUnitMrp').setValue(this.vOldMRP || 0)
      this.mrpform.get('curruntStockModel.oldUnitPur').setValue(this.vPurchaseRate || 0)
      this.mrpform.get('curruntStockModel.oldUnitLanded').setValue(this.vLandedRate || 0)


      console.log(this.mrpform.value);
      this._StockAdjustment.MRPAdjSave(this.mrpform.value).subscribe(response => {
        this._matDialog.closeAll();
        // this.Savebtn = false;
      });
    }
    else {
      let invalidFields = [];

      if (this.MRPAdjform.invalid) {
        for (const controlName in this.MRPAdjform.controls) {
          if (this.MRPAdjform.controls[controlName].invalid) {
            invalidFields.push(`MRP Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9.]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  OnReset() {
    this.MRPAdjform.reset();
    this._matDialog.closeAll();
  }
  onClose() {
    this._matDialog.closeAll();
  }


  getValidationMessages() {
    return {
      OldMRP: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      LandedRate: [
        { name: "pattern", Message: "only Number allowed." },
        { name: "min", Message: "Enter valid price." }
      ],
      PurchaseRate: [
        { name: "required", Message: "Qty required!", },
        { name: "pattern", Message: "only Number allowed.", },
        { name: "min", Message: "Enter valid qty.", }
      ],
      ConversionFactor: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      NewMRP: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      newLandedRate: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      NewPurchaseRate: [
        { name: "pattern", Message: "only Number allowed." }
      ]
    }
  }
}
