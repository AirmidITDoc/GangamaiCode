import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DischargetypeMasterService } from '../dischargetype-master.service';

@Component({
    selector: 'app-new-dischargetype',
    templateUrl: './new-dischargetype.component.html',
    styleUrls: ['./new-dischargetype.component.scss']
})
export class NewDischargetypeComponent implements OnInit {

    dischargetypeForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _DischargetypeMasterService: DischargetypeMasterService,
        public dialogRef: MatDialogRef<NewDischargetypeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.dischargetypeForm = this._DischargetypeMasterService.createDischargetypeForm();
        this.dischargetypeForm.markAllAsTouched();
        if ((this.data?.dischargeTypeId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.dischargetypeForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.dischargetypeForm.invalid) {
            console.log(this.dischargetypeForm.value)
            this._DischargetypeMasterService.dischargeTypeMasterSave(this.dischargetypeForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.dischargetypeForm.invalid) {
                for (const controlName in this.dischargetypeForm.controls) {
                    if (this.dischargetypeForm.controls[controlName].invalid) {
                        invalidFields.push(`dischargetype Form: ${controlName}`);
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
        this.dischargetypeForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            dischargeTypeName: [
                { name: "required", Message: "DischargeType Name is required" },
                { name: "maxlength", Message: "DischargeType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
