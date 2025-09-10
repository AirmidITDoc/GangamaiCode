import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { StockAdjustmentService } from '../stock-adjustment.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
  vOldTotalGSTPer: any = 0.0;
  GSTAdjustment: FormGroup;
  GSTAdjfinal: FormGroup;
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

      // this.vConversionFactor = this.registerObj.LandedRate

      this.GSTAdjustment = this.createGSTForm();
      this.GSTAdjustment.markAllAsTouched();
      this.GSTAdjfinal = this.createGSTfinalForm();

      this.GSTAdjustment.get('oldCgstper').setValue(this.registerObj.cgstper)
      this.GSTAdjustment.get('oldSgstper').setValue(this.registerObj.sgstper)
      this.GSTAdjustment.get('oldIgstper').setValue(this.registerObj.igstper)
      this.calculationOldGst(this.registerObj)
    }
  }

  createGSTForm() {

    return this._formBuilder.group({

      storeId: [this.accountService.currentUserValue.user.storeId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      stkId: [this.registerObj.stockId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [this.registerObj.itemId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      batchNo: [''],
      oldCgstper: ['', [Validators.required, Validators.min(0)]],
      oldSgstper: ['', [Validators.required, Validators.min(0)]],
      oldIgstper: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      cgstper: ['', [Validators.required, this._FormvalidationserviceService.validGstValidator([0, 2.5, 5, 12, 18, 28])]],
      sgstper:  ['', [Validators.required, this._FormvalidationserviceService.validGstValidator([0, 2.5, 5, 12, 18, 28])]],
      igstper:  ['', [Validators.required, this._FormvalidationserviceService.validGstValidator([0, 2.5, 5, 12, 18, 28])]],
      addedBy: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  createGSTfinalForm() {
    return this._formBuilder.group({
      OldTotalGSTPer: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      TotalGSTPer: ['', [Validators.required, Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],

    })
  }

  onInputChange(event: any) {
  if (event.target.value === '2.5') {
    event.target.value = '';
  }
}
// validateRate(value: any) {
//   if (parseFloat(value) === 2.5) {
//     this.showError = true;
//     this.rate = null;   // clear value
//   } else {
//     this.showError = false;
//   }
// }

  gstflag = false
  // getchangegstper(Id, rate, GSTTYP): void {

  //   console.log(Id)
  //   const formValues = this.GSTAdjustment.getRawValue() as GRNFormModel;
  //   const gstValues = [
  //     { value: 2.5 },
  //     { value: 6 },
  //     { value: 9 },
  //     { value: 14 }
  //   ];
    
  //   const numericRate = parseFloat(rate);
  //   if (!isNaN(numericRate) && numericRate >= 2.5) {
  //     // const exists = gstValues.some(item => item.value === rate);

  //     gstValues.forEach(element => {
  //       console.log(element)
  //       debugger
  //       if (element.value == rate){
  //         this.gstflag = true
  //         return;
  //       }
  //      });
  //     console.log(this.gstflag)
  //     debugger
  //     if (!this.gstflag) {
  //       debugger
  //       this._StockAdjustment.showToast('Please enter GST percentage as 2.5%, 6%, 9% or 14%', ToastType.WARNING);
  //       this.gstflag = false

  //       if (Id == 1)
  //         this.GSTAdjustment.get('cgstper').setValue(0);
  //       else if (Id == 2)
  //         this.GSTAdjustment.get('sgstper').setValue(0);
  //       else
  //         this.GSTAdjustment.get('igstper').setValue(0)
  //       return;
  //     } else {
  //       const GSTPer = Number(formValues.CGST) + Number(formValues.SGST) + Number(formValues.IGST)
  //       this.GSTAdjfinal.patchValue({
  //         GST: GSTPer
  //       });
  //       this.calculationAmt();
  //     }
  //   }
  //   else {
  //     this._StockAdjustment.showToast('Please enter GST percentage as 2.5%, 6%, 9% or 14%', ToastType.WARNING);
  //     return;
  //   }

  // }
  calculationAmt() {
    this.vTotalGSTPer = (parseFloat(this.GSTAdjustment.get('cgstper').value) + parseFloat(this.GSTAdjustment.get('sgstper').value) + parseFloat(this.GSTAdjustment.get('igstper').value)).toFixed(2);
    this.GSTAdjfinal.get('TotalGSTPer').setValue(this.vTotalGSTPer)
  }
  calculationOldGst(obj) {
    this.vOldTotalGSTPer = (parseFloat(obj.cgstper) + parseFloat(obj.sgstper) + parseFloat(obj.sgstper)).toFixed(2);
    this.GSTAdjfinal.get('OldTotalGSTPer').setValue(this.vOldTotalGSTPer)
  }

  Savebtn: boolean = false;
  onSubmit() {
    debugger


    console.log(this.GSTAdjustment.value)
    this.GSTAdjustment.get('storeId').setValue(this.accountService.currentUserValue.user.storeId || 0)
    this.GSTAdjustment.get('stkId').setValue(this.registerObj.stockId || 0)
    this.GSTAdjustment.get('itemId').setValue(this.registerObj.itemId || 0)
    this.GSTAdjustment.get('batchNo').setValue(this.registerObj.batchNo || '')

    this.GSTAdjustment.get('addedBy').setValue(this.accountService.currentUserValue.userId || 0)
    console.log(this.GSTAdjustment.value)
    if (!this.GSTAdjustment.invalid) {
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
      ],
      IGSTPer: [
        { name: "pattern", Message: "only Number allowed.", },
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

  // keyPressCharater(event) {
  //   var inp = String.fromCharCode(event.keyCode);
  //   if (/^\d*\.?\d*$/.test(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  OnReset() {
    this._StockAdjustment.GSTAdjustment.reset();
    this._matDialog.closeAll();
  }
  onClose() {
    this._matDialog.closeAll();
  }
}

// forbidSpecificValue(blocked: number) {
//   return (control: AbstractControl) => {
//     return parseFloat(control.value) === blocked ? { invalidValue: true } : null;
//   };
// }