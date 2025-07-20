import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { TemplateServieService } from '../template-servie.service';

@Component({
    selector: 'app-template-form',
    templateUrl: './template-form.component.html',
    styleUrls: ['./template-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormComponent implements OnInit {

    templateForm: FormGroup;
    vTemplateName: any;
    TemplateId = 0;
    vTemplateDescInHtml = '';
    vTemplateDesc = '';
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
        public _TemplateServieService: TemplateServieService,
        public dialogRef: MatDialogRef<TemplateFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _formBuilder1: UntypedFormBuilder,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.templateForm = this.createTemplateForm();
        this.templateForm.markAllAsTouched();

        console.log(this.data)
        if (this.data) {
            this.vTemplateName = this.data.templateName;
            this.vTemplateDesc = this.data.templateDesc;
            this.TemplateId = this.data.templateId;
            this.vTemplateDescInHtml = this.data.templateDescInHtml;
            // this.templateForm.patchValue(this.data)
        }
    }

    createTemplateForm(): FormGroup {
        return this._formBuilder1.group({
            templateId: this.TemplateId,
            templateName: '',
            templateDesc: this.vTemplateDesc,
            templateDescInHtml: ''
            // IsDeleted: ['true']
        });
    }

    add() {
        this.vTemplateDesc = ""
    }
    onSubmit() {
        if (!this.templateForm.invalid) {
            console.log(this.templateForm.value)
            this._TemplateServieService.templateMasterSave(this.templateForm.value).subscribe((response) => {
                this.dialogRef.close()
            });
        } {
            let invalidFields = [];
            if (this.templateForm.invalid) {
                for (const controlName in this.templateForm.controls) {
                    if (this.templateForm.controls[controlName].invalid) {
                        invalidFields.push(`template Form: ${controlName}`);
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
    onClose() {
        this.templateForm.reset();
        this.dialogRef.close();
    }

    onClear(val: boolean) {
        this.templateForm.reset();
        this.dialogRef.close(val);
    }

}
