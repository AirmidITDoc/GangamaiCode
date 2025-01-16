import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TermsOfPaymentMasterService } from '../terms-of-payment-master.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-termofpayment',
  templateUrl: './new-termofpayment.component.html',
  styleUrls: ['./new-termofpayment.component.scss']
})
export class NewTermofpaymentComponent implements OnInit {

    termsofpaymentForm: FormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;

    constructor(
      public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
      public dialogRef: MatDialogRef<NewTermofpaymentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.termsofpaymentForm = this._TermsOfPaymentMasterService.createtermsofpaymentForm();
      if((this.data?.Id??0) > 0)
        {
        this.isActive=this.data.isActive
        this.termsofpaymentForm.patchValue(this.data);
      }
    }
    
    
    onSubmit() {
        
        if(!this.termsofpaymentForm.invalid)
        {
            this.saveflag = true;
            
            console.log("TermsOfPaymentMaster Insert:",this.termsofpaymentForm.value)
            
            this._TermsOfPaymentMasterService.termofpayMasterSave(this.termsofpaymentForm.value).subscribe((response) => {
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
    this.termsofpaymentForm.reset();
    this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            TermsOfPayment: [
                { name: "required", Message: "TermsOfPayment Name is required" },
                { name: "maxlength", Message: "TermsOfPayment name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
