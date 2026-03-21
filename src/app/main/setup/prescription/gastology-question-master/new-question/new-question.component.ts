import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { QuestionMasterService } from '../question-master.service';

@Component({
    selector: 'app-new-question',
    templateUrl: './new-question.component.html',
    styleUrls: ['./new-question.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewQuestionComponent {
    QuestionForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _QuestionMasterService: QuestionMasterService,
        public dialogRef: MatDialogRef<NewQuestionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.QuestionForm = this._QuestionMasterService.createquestionForm();
        this.QuestionForm.markAllAsTouched();
        if ((this.data?.questionId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.QuestionForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.QuestionForm.invalid) {
            console.log(this.QuestionForm.value)
            this._QuestionMasterService.questionMasterSave(this.QuestionForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.QuestionForm.invalid) {
                for (const controlName in this.QuestionForm.controls) {
                    if (this.QuestionForm.controls[controlName].invalid) {
                        invalidFields.push(`Question Form: ${controlName}`);
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
        this.QuestionForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            questionName: [
                { name: "required", Message: "Question Name is required" },
                { name: "maxlength", Message: "Question name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            shortCutvalues: []
        };
    }
}
