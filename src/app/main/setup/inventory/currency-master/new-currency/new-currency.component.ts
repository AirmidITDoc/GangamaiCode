import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CurrencymasterService } from '../currencymaster.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-currency',
  templateUrl: './new-currency.component.html',
  styleUrls: ['./new-currency.component.scss']
})
export class NewCurrencyComponent implements OnInit {

    Saveflag: boolean= false;
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
      if(this.data){
        this.isActive=this.data.isActive
        this.currencyForm.patchValue(this.data);
     }
  }

    onSubmit() {
    this.Saveflag=true
    
      if (this.currencyForm.valid) {
          this._CurrencymasterService.currencyMasterSave(this.currencyForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.currencyForm.reset();
      this.dialogRef.close(val);
  }

}
