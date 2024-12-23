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

    constructor(
      public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
      public dialogRef: MatDialogRef<NewTermofpaymentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.termsofpaymentForm = this._TermsOfPaymentMasterService.createtermsofpaymentForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.termsofpaymentForm.patchValue(this.data);
      }
    }
    
    saveflag : boolean = false;
    onSubmit() {
        this.saveflag = true;
        debugger
        var m_data =
            {
                "id": 0,
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

    onClear(val: boolean) {
    this.termsofpaymentForm.reset();
    this.dialogRef.close(val);
    }

}
