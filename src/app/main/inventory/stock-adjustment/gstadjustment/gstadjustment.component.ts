import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { GRNFormModel, ToastType } from 'app/main/purchase/good-receiptnote/new-grn/types';


@Component({
  selector: 'app-gstadjustment',
  templateUrl: './gstadjustment.component.html',
  styleUrls: ['./gstadjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GSTAdjustmentComponent implements OnInit {

  dateTimeObj: any;
  vCGSTPer: any;
  vSGSTPer: any;
  vIGSTPer: any;
  vNewCGSTPer: any = 0;
  vNewSGSTPer: any = 0;
  vNewIGSTPer: any = 0;
  vTotalGSTPer: any = 0;
  registerObj: any;
  itemname: any;
  vOldTotalGSTPer: any;
  GSTAdjustment: FormGroup;
  constructor(
    public _StockAdjustment: StockAdjustmentService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<GSTAdjustmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vCGSTPer = this.registerObj.cgstper;
      this.vSGSTPer = this.registerObj.sgstper;
      this.vIGSTPer = this.registerObj.igstper;
      this.itemname = this.registerObj.itemName;
      this.calculationOldGst(this.registerObj)
      // this.vConversionFactor = this.registerObj.LandedRate

      this.GSTAdjustment = this.createGSTForm();
      this.GSTAdjustment.markAllAsTouched();
      this.GSTAdjustment.get('oldCgstper').setValue(this.registerObj.cgstper)
      this.GSTAdjustment.get('oldSgstper').setValue(this.registerObj.sgstper)
      this.GSTAdjustment.get('oldIgstper').setValue(this.registerObj.igstper)
    }
  }



  createGSTForm() {
    return this._formBuilder.group({
      storeId: [this.accountService.currentUserValue.user.storeId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      stkId: [this.registerObj.stockId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [this.registerObj.itemId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      batchNo: ['', [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      oldCgstper: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      oldSgstper: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      oldIgstper: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      cgstper: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      sgstper: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      igstper: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      addedBy: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  gstflag = false
  getchangegstper(Id,rate, GSTTYP): void {
    
    console.log(Id)
    const formValues = this.GSTAdjustment.getRawValue() as GRNFormModel;
    const gstValues = [
      { value: 2.5 },
      { value: 6 },
      { value: 9 },
      { value: 14 }
    ];
    debugger
    const numericRate = parseFloat(rate);
    if (!isNaN(numericRate) && numericRate >= 2.5) {
      // const exists = gstValues.some(item => item.value === rate);

      gstValues.forEach(element => {
        console.log(element)
        if (element.value == rate)
          this.gstflag = true
        return;
        // else
        //    this.gstflag = false
      });
console.log( this.gstflag)

      if (!this.gstflag) {
        this._StockAdjustment.showToast('Please enter GST percentage as 2.5%, 6%, 9% or 14%', ToastType.WARNING);
        this.gstflag = true
        
        // if(formValues.CGST)
        //   this.GSTAdjustment.get('cgstper').setValue(0)
        // else  if(formValues.SGST)
        //   this.GSTAdjustment.get('sgstper').setValue(0)
        // else
        //    if(formValues.IGST)
        //   this.GSTAdjustment.get('igstper').setValue(0)
        return;
      } else if (this.gstflag) {
        const GSTPer = Number(formValues.CGST) + Number(formValues.SGST) + Number(formValues.IGST)
        this.GSTAdjustment.patchValue({
          GST: GSTPer
        });
        this.calculationAmt();
      }
    }
    else {
      this._StockAdjustment.showToast('Please enter GST percentage as 2.5%, 6%, 9% or 14%', ToastType.WARNING);
      return;
    }

  }
  calculationAmt() {
    debugger
    let CGSTPer = (this.vNewCGSTPer) || 0;
    let SGSTPer = (this.vNewSGSTPer) || 0;
    let IGSTPer = (this.vNewIGSTPer) || 0;


    this.vTotalGSTPer = (parseFloat(this.GSTAdjustment.get('cgstper').value) + parseFloat(this.GSTAdjustment.get('sgstper').value) + parseFloat(this.GSTAdjustment.get('igstper').value)).toFixed(2);
  }
  calculationOldGst(obj) {
    this.vOldTotalGSTPer = (parseFloat(obj.cgstper) + parseFloat(obj.sgstper) + parseFloat(obj.sgstper)).toFixed(2);
  }

  Savebtn: boolean = false;
  onSubmit() {

    if (!this.GSTAdjustment.invalid) {
      debugger
      if (this.gstflag = false)
        this.toastr.warning('Enter Proper GST Value ', 'Warning')
      return;

      // this.Savebtn = true;

      // let submitData = {
      //   "storeId": this.accountService.currentUserValue.user.storeId || 0,
      //   "stkId": this.registerObj.stockId || 0,
      //   "itemId": this.registerObj.itemId || 0,
      //   "batchNo": this.registerObj.batchNo || '',
      //   "oldCgstper": this._StockAdjustment.GSTAdjustment.get('CGSTPer').value || 0,
      //   "oldSgstper": this._StockAdjustment.GSTAdjustment.get('SGSTPer').value || 0,
      //   "oldIgstper": this._StockAdjustment.GSTAdjustment.get('IGSTPer').value || 0,
      //   "cgstper": this._StockAdjustment.GSTAdjustment.get('NewCGSTPer').value || 0,
      //   "sgstper": this._StockAdjustment.GSTAdjustment.get('NewSGSTPer').value || 0,
      //   "igstper": this._StockAdjustment.GSTAdjustment.get('NewIGSTPer').value || 0,
      //   "addedBy": this.accountService.currentUserValue.user.storeId  || 0
      // };
      // console.log(submitData);
      console.log(this.GSTAdjustment.value)
      this.GSTAdjustment.get('storeId').setValue(this.accountService.currentUserValue.user.storeId || 0)
      this.GSTAdjustment.get('stkId').setValue(this.registerObj.stockId || 0)
      this.GSTAdjustment.get('itemId').setValue(this.registerObj.itemId || 0)
      this.GSTAdjustment.get('batchNo').setValue(this.registerObj.batchNo || '')

      this.GSTAdjustment.get('addedBy').setValue(this.accountService.currentUserValue.userId || 0)
      console.log(this.GSTAdjustment.value)

      this._StockAdjustment.GSTAdjSave(this.GSTAdjustment.value).subscribe(response => {
        this._matDialog.closeAll();

      });
    } else {
      let invalidFields = [];

      if (this.GSTAdjustment.invalid) {
        for (const controlName in this.GSTAdjustment.controls) {
          if (this.GSTAdjustment.controls[controlName].invalid) {
            invalidFields.push(`GSt Form: ${controlName}`);
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


  getValidationMessages() {
    return {
      CGSTPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      SGSTPer: [
        { name: "pattern", Message: "only Number allowed." },
        { name: "min", Message: "Enter valid price." }
      ],
      IGSTPer: [
        // { name: "required", Message: "Qty required!", },
        { name: "pattern", Message: "only Number allowed.", },
        { name: "min", Message: "Enter valid qty.", }
      ],
      NewCGSTPer: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      NewSGSTPer: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      NewIGSTPer: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      TotalGSTPer: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      OldTotalGSTPer: [
        { name: "pattern", Message: "only Number allowed." }
      ]
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  OnReset() {
    this._StockAdjustment.GSTAdjustment.reset();
    this._matDialog.closeAll();
  }
  onClose() {
    this._matDialog.closeAll();
  }
}