
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HsncodeserviceService } from '../hsncodeservice.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-hsncode',
    templateUrl: './new-hsncode.component.html',
    styleUrls: ['./new-hsncode.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewHsncodeComponent {
    HsnccodeForm: FormGroup;
    isActive: boolean = true;
    vGst = ''
    vMUnit = ''
    vMUnitId = "0"
    GSTTypeID: any = 0;
    GSTTypeName: any = '';
    veffectiveto = new Date()
    veffectivefrom = new Date()
    autocompleteModeGSTTypesValues: string = "GSTTypes";
    autocompleteModePurchaseUOM: string = "UnitOfMeasurment";
    constructor(
        public _HsncodeserviceService: HsncodeserviceService,
        public dialogRef: MatDialogRef<NewHsncodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.HsnccodeForm = this._HsncodeserviceService.createItemHsncodeForm();
        this.HsnccodeForm.markAllAsTouched();
        console.log(this.data)

        if ((this.data?.hsncodeId ?? 0) > 0) {
            this.GSTTypeID = this.data.gstId
            this.GSTTypeName = this.data.gstRate

            this.vMUnit = this.data.unitOfMeasure
            this.vMUnitId = this.data.unitOfMeasureId

            this.isActive = this.data.isActive
            this.HsnccodeForm.patchValue(this.data);
        }
    }

    onSubmit() {
        debugger
        this.HsnccodeForm.get('gstId').setValue(parseInt(this.GSTTypeID))
        this.HsnccodeForm.get('gstRate').setValue(parseInt(this.GSTTypeName))
        this.HsnccodeForm.get('unitOfMeasure').setValue(this.vMUnit)
        this.HsnccodeForm.get('unitOfMeasureId').setValue(parseInt(this.vMUnitId))


        if (!this.HsnccodeForm.invalid) {
            console.log(this.HsnccodeForm.value)
            this._HsncodeserviceService.HsnccodeMasterSave(this.HsnccodeForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.HsnccodeForm.invalid) {
                for (const controlName in this.HsnccodeForm.controls) {
                    if (this.HsnccodeForm.controls[controlName].invalid) {
                        invalidFields.push(`HSNCODE Form: ${controlName}`);
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

    onGSTTypeChange(event: { value: number, text: string }) {
        debugger
        console.log(event)
        this.GSTTypeName = event.text
        this.GSTTypeID = event.value;
    }

    onunitChange(e) {
        this.vMUnitId = e.value
        this.vMUnit = e.text
    }
    onClear(val: boolean) {
        this.HsnccodeForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            hsncodeName: [
                { name: "required", Message: "hsncode is required" },
                { name: "maxlength", Message: "hsncode should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            GSTType: [],
            unitofmeasure: []

        };
    }
}
