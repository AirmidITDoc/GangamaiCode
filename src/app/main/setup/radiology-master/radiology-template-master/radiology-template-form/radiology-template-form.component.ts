import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { RadiologyTemplateMasterService } from '../radiology-template-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-radiology-template-form',
    templateUrl: './radiology-template-form.component.html',
    styleUrls: ['./radiology-template-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RadiologyTemplateFormComponent implements OnInit {
    templateForm: FormGroup;
    vTemplateDesc = '';
    vTemplateName: any;
    isActive: boolean = true;
    TemplateId = 0;

    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
        throw new Error('Method not implemented.');
    }

    constructor(
        public _TemplateServieService: RadiologyTemplateMasterService, private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<RadiologyTemplateFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.templateForm = this.createRadiologytemplateForm();
        this.templateForm.markAllAsTouched();
        if ((this.data?.templateId ?? 0) > 0) {
            this.vTemplateName = this.data.templateName;
            this.isActive = this.data.isActive
            this.vTemplateDesc = this.data.templateDesc;
            this.TemplateId = this.data.templateId;

            this.templateForm.patchValue(this.data);
        }
    }

    createRadiologytemplateForm(): FormGroup {
        return this._formBuilder.group({
            templateId: [this.TemplateId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            templateName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    // Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            templateDesc: this.vTemplateDesc,
            isActive: [true, [Validators.required]]
        });
    }

    onEditorValueChange(content: string) {
        this.templateForm.get('templateDesc')?.setValue(content);
    }


    onSubmit() {
        debugger
        console.log(this.templateForm.value)
        if (!this.templateForm.invalid) {
            console.log(this.templateForm.value)
            if (this.templateForm.get('templateDesc').value !== '') {
                this._TemplateServieService.templateMasterSave(this.templateForm.value).subscribe((response) => {
                    this.onClear(true);
                });
            } else Swal.fire("Enter Data In Editor..")
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
