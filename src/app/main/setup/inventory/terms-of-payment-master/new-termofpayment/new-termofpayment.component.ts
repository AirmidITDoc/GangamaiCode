import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TermsOfPaymentMasterService } from '../terms-of-payment-master.service';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-termofpayment',
  templateUrl: './new-termofpayment.component.html',
  styleUrls: ['./new-termofpayment.component.scss'],
   encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class NewTermofpaymentComponent implements OnInit {

    termsofpaymentForm: FormGroup;
    isActive:boolean=true;

    constructor(
      public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
      public dialogRef: MatDialogRef<NewTermofpaymentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.termsofpaymentForm = this._TermsOfPaymentMasterService.createtermsofpaymentForm();
      debugger
      if((this.data?.id??0) > 0)
            this.termsofpaymentForm.patchValue(this.data);
      
    }
    
    
    onSubmit() {
        
        if(!this.termsofpaymentForm.invalid)
        {
            
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
          termsOfPayment: [
                { name: "required", Message: "TermsOfPayment Name is required" },
                { name: "maxlength", Message: "TermsOfPayment name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
