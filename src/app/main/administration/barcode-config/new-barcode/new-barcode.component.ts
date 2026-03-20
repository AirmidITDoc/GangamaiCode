import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { BarcodeConfigService } from '../barcodeconfig.service';

@Component({
    selector: 'app-new-barcode',
    templateUrl: './new-barcode.component.html',
    styleUrls: ['./new-barcode.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewBarcodeComponent implements OnInit {

    TemplateSaveForm: FormGroup;
    id = 0;

    constructor(
        public _BarcodeConfigService: BarcodeConfigService, private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<NewBarcodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public _FormvalidationserviceService: FormvalidationserviceService,
    ) { }

    ngOnInit(): void {

        this.TemplateSaveForm = this.createSaveTemplateForm();
        this.TemplateSaveForm.markAllAsTouched();

        if (this.data?.id > 0) {
            console.log(this.data)
            this.id = this.data.id;
            //   this.TemplateSaveForm.get('isTemplateWithHeader')?.setValue(this.data.isTemplateWithHeader);
            //   this.TemplateSaveForm.get('isTemplateHeaderWithImage')?.setValue(this.data.isTemplateHeaderWithImage);
            //   this.TemplateSaveForm.get('templateDescription')?.setValue(this.data.templateDescription);
            this.TemplateSaveForm.patchValue(this.data);
        }

    }
    onEditorValueChange(content: string) {
        this.TemplateSaveForm.get('templateBody')?.setValue(content);
    }

    createSaveTemplateForm() {
        return this._formBuilder.group({
            id: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            templateCode: ['', Validators.required],
            templateBody: ['', Validators.required],
            width: ['', [Validators.required]],
            height: ['', [Validators.required]],
            padding: [''],
            margin: [''],
            barcodeData:[''],
            isActive: [true]
        })
    }


    onSubmit() {
        debugger
        this.TemplateSaveForm.patchValue({ id: this.id });
        if (this.TemplateSaveForm.valid) {

            console.log('json mdata:', this.TemplateSaveForm.value);
            this._BarcodeConfigService.barcodeConfigSave(this.TemplateSaveForm.value).subscribe((response) => {
                this.onClose();
            });
        } else {
            const invalidFields = [];
            if (this.TemplateSaveForm.invalid) {
                for (const controlName in this.TemplateSaveForm.controls) {
                    if (this.TemplateSaveForm.controls[controlName].invalid) { invalidFields.push(`Template Form: ${controlName}`); }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }
        }
    }
    onClose() {
        this.id = 0;
        this.TemplateSaveForm.reset();
        this.dialogRef.close();
    }
    onClear() {
        this.TemplateSaveForm.reset();
        this.dialogRef.close();
    }

    getValidationMessages() {
        return {
            width: [
                { name: "required", Message: "Width is required" }
            ],
            templateCode: [
                { name: "required", Message: "Template Code is required" }
            ],
            height: [
                { name: "required", Message: "Height is required" }
            ],
            templateBody: [
                { name: "required", Message: "Template Body is required" }
            ]
        };
    }
}
