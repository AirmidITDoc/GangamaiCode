import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { DoctorMasterService } from '../doctor-master.service';

@Component({
    selector: 'app-doctor-executive',
    templateUrl: './doctor-executive.component.html',
    styleUrls: ['./doctor-executive.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctorExecutiveComponent {
    executiveForm: FormGroup;
    doctorName: any;

    constructor(
        public _doctorService: DoctorMasterService,
        public dialogRef: MatDialogRef<DoctorExecutiveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {

        this.executiveForm = this._doctorService.createExectiveForm();
        this.executiveForm.markAllAsTouched();

        if ((this.data?.doctorId ?? 0) > 0) {
            this.doctorName = this.data.doctorName
            this.executiveForm.get('employeId').setValue(this.data.employeId)
            console.log(this.data)
        }
    }

    getSelectedObjCompany(obj) {
        this.executiveForm.get('employeId').setValue(obj.executiveId)
    }

    onSubmit() {
        this.executiveForm.get('id').setValue(this.data.id ?? 0)
        this.executiveForm.get('doctorId').setValue(this.data.doctorId)
        if (this.data.id > 0)
            this.executiveForm.removeControl('createdBy')
        else
            this.executiveForm.removeControl('modifiedBy')

        if (!this.executiveForm.invalid) {
            console.log(this.executiveForm.value)
            this._doctorService.doctorExecSave(this.executiveForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.executiveForm.invalid) {
                for (const controlName in this.executiveForm.controls) {
                    if (this.executiveForm.controls[controlName].invalid) {
                        invalidFields.push(`Form: ${controlName}`);
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
        this.executiveForm.reset();
        this.dialogRef.close(val);
    }
}
