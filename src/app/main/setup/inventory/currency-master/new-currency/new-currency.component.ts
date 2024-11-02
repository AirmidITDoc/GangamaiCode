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

  currencyForm: FormGroup;
  constructor(
      public _CurrencymasterService: CurrencymasterService,
      public dialogRef: MatDialogRef<NewCurrencyComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.currencyForm = this._CurrencymasterService.createCurrencyForm();
      var m_data = {
        currencyId: this.data?.currencyId,
        currencyName: this.data?.currencyName.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.currencyForm.patchValue(m_data);
  }
  onSubmit() {
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
