import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CreditreasonService } from '../creditreason.service';

@Component({
    selector: 'app-new-credit-reason',
    templateUrl: './new-credit-reason.component.html',
    styleUrls: ['./new-credit-reason.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCreditReasonComponent implements OnInit {

    creditreasonForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _CreditreasonService: CreditreasonService,
        public dialogRef: MatDialogRef<NewCreditReasonComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.creditreasonForm = this._CreditreasonService.createCreditreasonForm();
        if ((this.data?.creditId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.creditreasonForm.patchValue(this.data);
        }
    }
    onSubmit() {
        if (!this.creditreasonForm.invalid) {
            console.log(this.creditreasonForm.value)
            this._CreditreasonService.creditreasonMasterSave(this.creditreasonForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.creditreasonForm.invalid) {
                for (const controlName in this.creditreasonForm.controls) {
                    if (this.creditreasonForm.controls[controlName].invalid) {
                        invalidFields.push(`creditreason Form: ${controlName}`);
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
        this.creditreasonForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            creditReason: [
                { name: "required", Message: "Credit Reason is required" },
                { name: "maxlength", Message: "Credit Reason should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
