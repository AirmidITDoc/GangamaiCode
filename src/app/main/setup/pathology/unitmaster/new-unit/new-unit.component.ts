import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { UnitmasterService } from '../unitmaster.service';

@Component({
    selector: 'app-new-unit',
    templateUrl: './new-unit.component.html',
    styleUrls: ['./new-unit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewUnitComponent implements OnInit {

    unitForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _UnitmasterService: UnitmasterService,
        public dialogRef: MatDialogRef<NewUnitComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.unitForm = this._UnitmasterService.createUnitmasterForm();
        this.unitForm.markAllAsTouched();
        if ((this.data?.unitId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.unitForm.patchValue(this.data);
        }
    }


    onSubmit() {

        if (!this.unitForm.invalid) {
            console.log(this.unitForm.value)
            this._UnitmasterService.unitMasterSave(this.unitForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.unitForm.invalid) {
                for (const controlName in this.unitForm.controls) {
                    if (this.unitForm.controls[controlName].invalid) {
                        invalidFields.push(`unit Form: ${controlName}`);
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
        this.unitForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            unitName: [
                { name: "required", Message: "Unit Name is required" },
                { name: "maxlength", Message: "Unit name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
