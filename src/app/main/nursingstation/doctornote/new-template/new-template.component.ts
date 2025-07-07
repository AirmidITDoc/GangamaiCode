import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DoctornoteService } from '../doctornote.service';

@Component({
    selector: 'app-new-template',
    templateUrl: './new-template.component.html',
    styleUrls: ['./new-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {

    myform: FormGroup;
    Templateform: FormGroup;
    vTemplateDesc: any;
    isActive: boolean = true;

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '20rem',
        minHeight: '20rem',
        translate: 'yes',
        placeholder: 'Enter text here...',
        enableToolbar: true,
        showToolbar: true,
    };

    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
        throw new Error('Method not implemented.');
    }

    constructor(
        public _DoctornoteService: DoctornoteService,
        public dialogRef: MatDialogRef<NewTemplateComponent>,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.myform = this._DoctornoteService.createtemplateForm();
        this.Templateform = this._DoctornoteService.templateForm();
        if ((this.data?.templateId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.Templateform.patchValue(this.data);
        }
    }

    onSubmit() {

        if (!this.Templateform.invalid) {
            this.Templateform.get('addedBy').setValue(this.accountService.currentUserValue.userId)
            this.Templateform.get('updatedBy').setValue(this.accountService.currentUserValue.userId)
            // console.log("template json:", this.Templateform.value);

            this._DoctornoteService.templateMasterSave(this.Templateform.value).subscribe((response) => {
                this.onClose()
            });
        } else {
            let invalidFields = [];

            if (this.Templateform.invalid) {
                for (const controlName in this.Templateform.controls) {
                    if (this.Templateform.controls[controlName].invalid) {
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
                docsTempName: [
                    { name: "required", Message: "Template Name is required" },
                    { name: "maxlength", Message: "Template name should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ]
            }
        }

        onClose() {
            this.myform.reset();
            this.Templateform.reset();
            this.dialogRef.close();
        }

        onClear(val: boolean) {
            this.Templateform.reset();
            this.myform.reset();
            this.dialogRef.close(val);
        }
    }
