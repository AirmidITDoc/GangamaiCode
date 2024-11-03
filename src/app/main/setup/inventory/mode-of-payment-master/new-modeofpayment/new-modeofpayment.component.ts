import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModeOfPaymentMasterService } from '../mode-of-payment-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-modeofpayment',
  templateUrl: './new-modeofpayment.component.html',
  styleUrls: ['./new-modeofpayment.component.scss']
})
export class NewModeofpaymentComponent implements OnInit {


  modeofpayForm: FormGroup;
  constructor(
      public _ModeOfPaymentMasterService: ModeOfPaymentMasterService,
      public dialogRef: MatDialogRef<NewModeofpaymentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.modeofpayForm = this._ModeOfPaymentMasterService.createModeofpaymentForm();
      var m_data = {
        id: this.data?.id,
        modeOfPayment: this.data?.modeOfPayment.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.modeofpayForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.modeofpayForm.valid) {
          this._ModeOfPaymentMasterService.modeofpayMasterSave(this.modeofpayForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.modeofpayForm.reset();
      this.dialogRef.close(val);
  }
}
