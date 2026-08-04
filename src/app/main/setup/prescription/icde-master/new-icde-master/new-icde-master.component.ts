import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ICDEMasterService } from '../icde-master.service';


@Component({
  selector: 'app-new-icde-master',
  templateUrl: './new-icde-master.component.html',
  styleUrls: ['./new-icde-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewICDEMasterComponent {

    ICDEForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _ICDEMasterService: ICDEMasterService,
        public dialogRef: MatDialogRef<NewICDEMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.ICDEForm = this._ICDEMasterService.createICDEForm();
        this.ICDEForm.markAllAsTouched();
        if ((this.data?.icdid ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.ICDEForm.patchValue(this.data);
        }
    }

    onSubmit() {

        if (!this.ICDEForm.invalid) {
            console.log(this.ICDEForm.value)
            this._ICDEMasterService.IcdeMasterInsert(this.ICDEForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.ICDEForm.invalid) {
                for (const controlName in this.ICDEForm.controls) {
                    if (this.ICDEForm.controls[controlName].invalid) {
                        invalidFields.push(`dose Form: ${controlName}`);
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
        this.ICDEForm.reset();
        this.dialogRef.close(val);
    }
 
    getValidationMessages() {
        return {
            icdversion: [
                { name: "required", Message: "icdversione is required" },
              
            ],
            icdcode: [
                { name: "required", Message: "icdcode" },
             
            ],
            diagnosisName: [
                { name: "required", Message: "diagnosisName" }
            ],
            shortName: [
                { name: "required", Message: "shortName" }
            ]
        }
    }

}
