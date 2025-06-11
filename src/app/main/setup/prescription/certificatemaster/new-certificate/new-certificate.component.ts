import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { CertificateserviceService } from '../certificateservice.service';

@Component({
    selector: 'app-new-certificate',
    templateUrl: './new-certificate.component.html',
    styleUrls: ['./new-certificate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewCertificateComponent implements OnInit {
    templateForm: FormGroup;
    vTemplateDesc: any;
    vTemplateName: any;
    vcertificateName: any;
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
        public _CertificateserviceService: CertificateserviceService,
        public dialogRef: MatDialogRef<NewCertificateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.templateForm = this._CertificateserviceService.createRadiologytemplateForm();
        this.templateForm.markAllAsTouched();
        if ((this.data?.certificateId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.vTemplateDesc = this.data.certificateDesc
            this.vcertificateName = this.data.certificateName
            this.templateForm.patchValue(this.data);
        }
    }

    onSubmit() {

        if (!this.templateForm.invalid) {
            console.log(this.templateForm.value)
            this._CertificateserviceService.templateMasterSave(this.templateForm.value).subscribe((response) => {
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
            certificateName: [
                { name: "required", Message: "TemplateName is required" },
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
