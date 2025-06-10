import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ConcessionReasonMasterService } from '../concession-reason-master.service';


@Component({
    selector: 'app-new-concessionreason',
    templateUrl: './new-concessionreason.component.html',
    styleUrls: ['./new-concessionreason.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewConcessionreasonComponent implements OnInit {

    concessionForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _ConcessionReasonMasterService: ConcessionReasonMasterService,
        public dialogRef: MatDialogRef<NewConcessionreasonComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.concessionForm = this._ConcessionReasonMasterService.createConcessionreasonForm();
        this.concessionForm.markAllAsTouched();
        if ((this.data?.concessionId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.concessionForm.patchValue(this.data);
        }
    }

    onSubmit() {

        if (!this.concessionForm.invalid) {
            console.log(this.concessionForm.value)
            this._ConcessionReasonMasterService.concessionreasonMasterSave(this.concessionForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.concessionForm.invalid) {
                for (const controlName in this.concessionForm.controls) {
                    if (this.concessionForm.controls[controlName].invalid) {
                        invalidFields.push(`concession Form: ${controlName}`);
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
        this.concessionForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            concessionReason: [
                { name: "required", Message: "Concession Name is required" },
                { name: "maxlength", Message: "Concession name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
