import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemCategoryMasterService } from '../item-category-master.service';

@Component({
    selector: 'app-new-itemcategory',
    templateUrl: './new-itemcategory.component.html',
    styleUrls: ['./new-itemcategory.component.scss']
})
export class NewItemcategoryComponent implements OnInit {

    categoryForm: FormGroup;
    isActive: boolean = true;
    autocompleteModeItem: string = "ItemType";

    constructor(
        public _CategorymasterService: ItemCategoryMasterService,
        public dialogRef: MatDialogRef<NewItemcategoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.categoryForm = this._CategorymasterService.createItemCategoryForm();
        this.categoryForm.markAllAsTouched();
        if ((this.data?.itemCategoryId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.categoryForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.categoryForm.invalid) {
            console.log(this.categoryForm.value)
            this._CategorymasterService.categoryMasterSave(this.categoryForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.categoryForm.invalid) {
                for (const controlName in this.categoryForm.controls) {
                    if (this.categoryForm.controls[controlName].invalid) {
                        invalidFields.push(`category Form: ${controlName}`);
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

    itemId = 0;

    selectChangeItem(obj: any) {
        console.log(obj);
        this.itemId = obj
    }

    onClear(val: boolean) {
        this.categoryForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            itemCategoryName: [
                { name: "required", Message: "Category Name is required" },
                { name: "maxlength", Message: "Category name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            itemTypeId: [
                { name: "required", Message: "ItemType is required" }
            ],
        };
    }
}
