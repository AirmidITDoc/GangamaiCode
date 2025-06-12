import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModeOfPaymentMasterService } from '../mode-of-payment-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-modeofpayment',
    templateUrl: './new-modeofpayment.component.html',
    styleUrls: ['./new-modeofpayment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewModeofpaymentComponent implements OnInit {


    modeofpayForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _ModeOfPaymentMasterService: ModeOfPaymentMasterService,
        public dialogRef: MatDialogRef<NewModeofpaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.modeofpayForm = this._ModeOfPaymentMasterService.createModeofpaymentForm();
        this.modeofpayForm.markAllAsTouched();
        if ((this.data?.id ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.modeofpayForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.modeofpayForm.invalid) {
            console.log(this.modeofpayForm.value)
            this._ModeOfPaymentMasterService.modeofpayMasterSave(this.modeofpayForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.modeofpayForm.invalid) {
                for (const controlName in this.modeofpayForm.controls) {
                    if (this.modeofpayForm.controls[controlName].invalid) {
                        invalidFields.push(`modeofpay Form: ${controlName}`);
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
