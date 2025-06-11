import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CurrencymasterService } from '../currencymaster.service';

@Component({
  selector: 'app-new-currency',
  templateUrl: './new-currency.component.html',
  styleUrls: ['./new-currency.component.scss']
})
export class NewCurrencyComponent implements OnInit {


  currencyForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _CurrencymasterService: CurrencymasterService,
    public dialogRef: MatDialogRef<NewCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.currencyForm = this._CurrencymasterService.createCurrencyForm();
    this.currencyForm.markAllAsTouched();
    if ((this.data?.currencyId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.currencyForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.currencyForm.invalid) {
      console.log(this.currencyForm.value)
      this._CurrencymasterService.currencyMasterSave(this.currencyForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.currencyForm.invalid) {
        for (const controlName in this.currencyForm.controls) {
          if (this.currencyForm.controls[controlName].invalid) {
            invalidFields.push(`currency Form: ${controlName}`);
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

  onClear(val: boolean) {
    this.currencyForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      currencyName: [
        { name: "required", Message: "Currency Name is required" },
        { name: "maxlength", Message: "Currency name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }

}
