import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CompanyMasterService } from '../company-master.service';

@Component({
    selector: 'app-company-executive',
    templateUrl: './company-executive.component.html',
    styleUrls: ['./company-executive.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyExecutiveComponent {
    executiveForm: FormGroup;
    companyName: any;

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyExecutiveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {

        this.executiveForm = this._CompanyMasterService.createExectiveForm();
        this.executiveForm.markAllAsTouched();

        if ((this.data?.companyId ?? 0) > 0) {
            this.companyName = this.data.companyName
            this.executiveForm.get('employeId').setValue(this.data.employeId)
            console.log(this.data)
        }
    }

    getSelectedObjCompany(obj) {
        this.executiveForm.get('employeId').setValue(obj.executiveId)
    }

    onSubmit() {
        this.executiveForm.get('Id').setValue(this.data.id ?? 0)
        this.executiveForm.get('companyId').setValue(this.data.companyId)
        if (!this.executiveForm.invalid) {
            console.log(this.executiveForm.value)
            this._CompanyMasterService.companyExecSave(this.executiveForm.value).subscribe((response) => {
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
