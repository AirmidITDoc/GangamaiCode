import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemTypeMasterService } from '../item-type-master.service';

@Component({
    selector: 'app-new-itemtype',
    templateUrl: './new-itemtype.component.html',
    styleUrls: ['./new-itemtype.component.scss']
})
export class NewItemtypeComponent implements OnInit {

    itemtypeForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _ItemTypeMasterService: ItemTypeMasterService,
        public dialogRef: MatDialogRef<NewItemtypeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.itemtypeForm = this._ItemTypeMasterService.createItemtypeForm();
        this.itemtypeForm.markAllAsTouched();
        if ((this.data?.itemTypeId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.itemtypeForm.patchValue(this.data);
        }
    }


    onSubmit() {
        if (!this.itemtypeForm.invalid) {
            console.log(this.itemtypeForm.value)
            this._ItemTypeMasterService.itemtypeMasterSave(this.itemtypeForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.itemtypeForm.invalid) {
                for (const controlName in this.itemtypeForm.controls) {
                    if (this.itemtypeForm.controls[controlName].invalid) {
                        invalidFields.push(`itemtype Form: ${controlName}`);
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
        this.itemtypeForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            itemTypeName: [
                { name: "required", Message: "Item Type Name is required" },
                { name: "maxlength", Message: "Item Type name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
