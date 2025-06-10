import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { MaritalstatusMasterService } from '../maritalstatus-master.service';

@Component({
    selector: 'app-new-maritalstatus',
    templateUrl: './new-maritalstatus.component.html',
    styleUrls: ['./new-maritalstatus.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewMaritalstatusComponent implements OnInit {
    maritalForm: FormGroup;
    isActive: boolean = true;

    constructor(public _MaritalstatusMasterService: MaritalstatusMasterService,
        public dialogRef: MatDialogRef<NewMaritalstatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService) { }

    ngOnInit(): void {
        this.maritalForm = this._MaritalstatusMasterService.createMaritalForm();
        this.maritalForm.markAllAsTouched();

        if ((this.data?.maritalStatusId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.maritalForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.maritalForm.invalid) {
            console.log(this.maritalForm.value)
            this._MaritalstatusMasterService.MaritalStatusMasterSave(this.maritalForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.maritalForm.invalid) {
                for (const controlName in this.maritalForm.controls) {
                    if (this.maritalForm.controls[controlName].invalid) {
                        invalidFields.push(`Maritalstatus Form: ${controlName}`);
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
            maritalStatusName: [
                { name: "required", Message: "Marital Status Name  is required" },
                { name: "maxlength", Message: "Marital Status Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    onClear(val: boolean) {
        this.maritalForm.reset();
        this.dialogRef.close(val);
    }
}