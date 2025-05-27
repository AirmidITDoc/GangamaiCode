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
    isActive:boolean=true;

    constructor(
        public _CurrencymasterService: CurrencymasterService,
        public dialogRef: MatDialogRef<NewCurrencyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.currencyForm = this._CurrencymasterService.createCurrencyForm();
      this.currencyForm.markAllAsTouched();
      if((this.data?.currencyId??0) > 0)
        {
        this.isActive=this.data.isActive
        this.currencyForm.patchValue(this.data);
     }
    }

    onSubmit() {
      if (!this.currencyForm.invalid) 
      {

        console.log("Currency JSON :-",this.currencyForm.value);

        this._CurrencymasterService.currencyMasterSave(this.currencyForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
          }, (error) => {
            this.toastr.error(error.message);
          });
      }
      else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
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
