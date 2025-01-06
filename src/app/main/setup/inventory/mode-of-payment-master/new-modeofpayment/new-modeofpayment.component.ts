import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ModeOfPaymentMasterService } from '../mode-of-payment-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-modeofpayment',
  templateUrl: './new-modeofpayment.component.html',
  styleUrls: ['./new-modeofpayment.component.scss']
})
export class NewModeofpaymentComponent implements OnInit {


  modeofpayForm: UntypedFormGroup;
  isActive:boolean=true;

  constructor(
      public _ModeOfPaymentMasterService: ModeOfPaymentMasterService,
      public dialogRef: MatDialogRef<NewModeofpaymentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.modeofpayForm = this._ModeOfPaymentMasterService.createModeofpaymentForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.modeofpayForm.patchValue(this.data);
      }
  }

  saveflag : boolean = false;
  onSubmit() {
      if(!this.modeofpayForm.invalid)
        {
            this.saveflag = true;

            console.log("TaxMaster Insert:",this.modeofpayForm.value);

            this._ModeOfPaymentMasterService.modeofpayMasterSave(this.modeofpayForm.value).subscribe((response) => {
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
      this.modeofpayForm.reset();
      this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
        modeOfPayment: [
            { name: "required", Message: "modeOfPayment Name is required" },
            { name: "maxlength", Message: "modeOfPayment name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
    }
  
}
