import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { TermsOfPaymentMasterService } from '../terms-of-payment-master.service';

@Component({
    selector: 'app-new-termofpayment',
    templateUrl: './new-termofpayment.component.html',
    styleUrls: ['./new-termofpayment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTermofpaymentComponent implements OnInit {

    termsofpaymentForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
        public dialogRef: MatDialogRef<NewTermofpaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.termsofpaymentForm = this._TermsOfPaymentMasterService.createtermsofpaymentForm();
        this.termsofpaymentForm.markAllAsTouched();

        if ((this.data?.id ?? 0) > 0) {
            this.isActive = this.data.isActive;
            this.termsofpaymentForm.patchValue(this.data);
        }

    }


    onSubmit() {

        if (!this.termsofpaymentForm.invalid) {
            console.log(this.termsofpaymentForm.value)
            this._TermsOfPaymentMasterService.termofpayMasterSave(this.termsofpaymentForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.termsofpaymentForm.invalid) {
                for (const controlName in this.termsofpaymentForm.controls) {
                    if (this.termsofpaymentForm.controls[controlName].invalid) {
                        invalidFields.push(`termsofpayment Form: ${controlName}`);
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
