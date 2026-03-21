import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
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
            // this.vcertificateName = this.data.certificateName
            // this.templateForm.patchValue(this.data);
            this.vTemplateDesc = this.data.certificateDesc
            this.templateForm.get('certificateDesc').setValue(this.vTemplateDesc)
            this.templateForm.patchValue({
                certificateId: this.data.certificateId,
                certificateName: this.data.certificateName,
            });
        }
    }

    onEditorValueChange(content: string) {
        this.templateForm.get('certificateDesc')?.setValue(content);
    }

    onSubmit() {
        if (!this.templateForm.invalid) {
            this.templateForm.get('certificateName')?.setValue(this.templateForm.get('certificateName')?.value ?? this.data.certificateName);
            console.log(this.templateForm.value)
            this._CertificateserviceService.templateMasterSave(this.templateForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
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
