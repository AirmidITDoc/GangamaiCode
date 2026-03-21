import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SubresultMasterService } from '../subresult-master.service';

@Component({
    selector: 'app-new-sub-result-value',
    templateUrl: './new-sub-result-value.component.html',
    styleUrls: ['./new-sub-result-value.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NEWSubResultValueComponent {
    SubresultvaluesForm: FormGroup;
    isActive: boolean = true;
    autocompleteModesQuesiontatus: string = "QuestionMaster";
    autocompleteModesSubQuesiontatus: string = "SubQuestionMaster";

    constructor(
        public _SubresultMasterService: SubresultMasterService,
        public dialogRef: MatDialogRef<NEWSubResultValueComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.SubresultvaluesForm = this._SubresultMasterService.createSubresultvaluesForm();
        this.SubresultvaluesForm.markAllAsTouched();
        if ((this.data?.subQuestionValId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.SubresultvaluesForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.SubresultvaluesForm.invalid) {
            console.log(this.SubresultvaluesForm.value)
            this._SubresultMasterService.subresultSave(this.SubresultvaluesForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.SubresultvaluesForm.invalid) {
                for (const controlName in this.SubresultvaluesForm.controls) {
                    if (this.SubresultvaluesForm.controls[controlName].invalid) {
                        invalidFields.push(`Subresult values Form: ${controlName}`);
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
        this.SubresultvaluesForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            subQuestionValName: [
                { name: "required", Message: "subQuestionVal Name is required" },
                { name: "maxlength", Message: "subQuestionValName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            questionId: [],
            subQuestionValId: [],
        };
    }
}
