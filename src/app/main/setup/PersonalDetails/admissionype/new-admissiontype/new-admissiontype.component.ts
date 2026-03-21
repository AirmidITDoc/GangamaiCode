import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdmissiontypeService } from '../admissiontype.service';

@Component({
    selector: 'app-new-admissiontype',
    templateUrl: './new-admissiontype.component.html',
    styleUrls: ['./new-admissiontype.component.scss']
})
export class NewAdmissiontypeComponent {
    AdmissiontypeForm: FormGroup;
    isActive: boolean = true

    constructor(
        public _AdmissiontypeService: AdmissiontypeService,
        public dialogRef: MatDialogRef<NewAdmissiontypeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.AdmissiontypeForm = this._AdmissiontypeService.createadmissiontypeForm();
        this.AdmissiontypeForm.markAllAsTouched();

        if ((this.data?.admissiontypeId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.AdmissiontypeForm.patchValue(this.data);
        }
    }


    onSubmit() {
        if (!this.AdmissiontypeForm.invalid) {
            console.log(this.AdmissiontypeForm.value)
            this._AdmissiontypeService.AdmissiontypeMasterSave(this.AdmissiontypeForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.AdmissiontypeForm.invalid) {
                for (const controlName in this.AdmissiontypeForm.controls) {
                    if (this.AdmissiontypeForm.controls[controlName].invalid) {
                        invalidFields.push(`Admission Type Form: ${controlName}`);
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

    getValidationMessages() {
        return {
            admissiontypeName: [
                { name: "required", Message: "AdmissiontypeNameis required" },

            ]
        };
    }

    onClear(val: boolean) {
        this.AdmissiontypeForm.reset();
        this.dialogRef.close(val);
    }


}
