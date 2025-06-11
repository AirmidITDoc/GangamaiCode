import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';

@Component({
    selector: 'app-radiology-template-form',
    templateUrl: './radiology-template-form.component.html',
    styleUrls: ['./radiology-template-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RadiologyTemplateFormComponent implements OnInit {
    templateForm: FormGroup;
    vTemplateDesc: any;
    vTemplateName: any;
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
        public _TemplateServieService: RadiologyTemplateMasterService,
        public dialogRef: MatDialogRef<RadiologyTemplateFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    //   ngOnInit(): void {
    //       this.templateForm = this._TemplateServieService.createRadiologytemplateForm();
    //       var m_data = {
    //           templateId: this.data?.templateId,
    //           templateName: this.data?.templateName.trim(),
    //           templateDesc: this.data?.templateDesc.trim(),
    //       };
    //       this.templateForm.patchValue(m_data);
    //   }

    ngOnInit(): void {
        this.templateForm = this._TemplateServieService.createRadiologytemplateForm();
        this.templateForm.markAllAsTouched();
        if ((this.data?.templateId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.vTemplateDesc = this.data.templateDesc;
            this.templateForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.templateForm.invalid) {
            console.log(this.templateForm.value)
            this._TemplateServieService.templateMasterSave(this.templateForm.value).subscribe((response) => {
                this.onClear(true);
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

    getValidationMessages() {
        return {
            templateName: [
                { name: "required", Message: "templateName Name is required" },
                { name: "maxlength", Message: "templateName name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
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
