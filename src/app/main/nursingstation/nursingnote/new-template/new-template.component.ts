import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { NursingnoteService } from '../nursingnote.service';

@Component({
    selector: 'app-new-template',
    templateUrl: './new-template.component.html',
    styleUrls: ['./new-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {

    myform: FormGroup;
    myTemplateform: FormGroup;
    vTemplateDesc: any;
    isActive: boolean = true;
  categoryType="0";

    constructor(
        public _NursingnoteService: NursingnoteService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<NewTemplateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.myform = this._NursingnoteService.createtemplateForm();
        this.myTemplateform = this._NursingnoteService.templateForm();
        if ((this.data?.templateId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.myTemplateform.patchValue(this.data);
        }
    }

    onEditorValueChange(content: string) {
        console.log("Got from editor:", content);
        this.myTemplateform.get('templateDesc')?.setValue(content);
    }

    onSubmit() {
        if (!this.myTemplateform.invalid) {
            this._NursingnoteService.templateMasterSave(this.myTemplateform.value).subscribe((response) => {
                this.onClear(true);
            });
        } else {
            const invalidFields = [];

            if (this.myTemplateform.invalid) {
                for (const controlName in this.myTemplateform.controls) {
                    if (this.myTemplateform.controls[controlName].invalid) {
                        invalidFields.push(`Template Form: ${controlName}`);
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
            nursTempName: [
                { name: "required", Message: "templateName Name is required" },
                { name: "maxlength", Message: "templateName name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

    onClose() {
        this.myTemplateform.reset();
        this.myform.reset();
        this.dialogRef.close();
    }

    onClear(val: boolean) {
        this.myTemplateform.reset();
        this.myform.reset();
        this.dialogRef.close(val);
    }
}
