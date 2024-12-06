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

    constructor(
      public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
      public dialogRef: MatDialogRef<NewTermofpaymentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.termsofpaymentForm = this._TermsOfPaymentMasterService.createtermsofpaymentForm();
      var m_data = {
        Id: this.data?.Id,
        currencyName: this.data?.currencyName.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.termsofpaymentForm.patchValue(m_data);
    }
    
    onSubmit() {
        if (this.termsofpaymentForm.invalid) {
        this.toastr.warning('please check form is invalid', 'Warning !', {
            toastClass:'tostr-tost custom-toast-warning',
        })
        return;
        }else{
        debugger
        var m_data =
        {
            "Id": 0,
            "TermsOfPayment": this.termsofpaymentForm.get("TermsOfPayment").value,
        }

        console.log("TermsOfPaymentMaster Insert:",m_data)
        
        this._TermsOfPaymentMasterService.termofpayMasterSave(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
        }, (error) => {
        this.toastr.error(error.message);
        });
      }
    }

    onClear(val: boolean) {
    this.termsofpaymentForm.reset();
    this.dialogRef.close(val);
    }

}
