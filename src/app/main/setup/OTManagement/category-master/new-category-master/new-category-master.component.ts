import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CategoryMasterService } from '../category-master.service';

@Component({
    selector: 'app-new-category-master',
    templateUrl: './new-category-master.component.html',
    styleUrls: ['./new-category-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCategoryMasterComponent implements OnInit {
    myForm: FormGroup;
    isActive: boolean = true;
    categoryName: any = ''
    surgeryCategoryId=0
    constructor(
        public _CategoryMasterService: CategoryMasterService,
        public dialogRef: MatDialogRef<NewCategoryMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.myForm = this._CategoryMasterService.createCategoryForm();
        this.myForm.markAllAsTouched();

        console.log(this.data)
        if ((this.data?.surgeryCategoryId ?? 0) > 0) {
            this.categoryName = this.data.surgeryCategoryName
            this.surgeryCategoryId=this.data.surgeryCategoryId
            // this.myForm.patchValue(this.data);
        }
    }


    onSubmit() {
        if (!this.myForm.invalid) {
            console.log(this.myForm.value)
            this._CategoryMasterService.CatMasterSave(this.myForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`myForm Form: ${controlName}`);
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
            // talukaName: [
            //     { name: "required", Message: "City Name is required" }
            // ],
            SurgeryCategoryName: [
                { name: "required", Message: "category Name is required" },
                { name: "maxlength", Message: "category Name should not be greater than 50 char." },
                { name: "pattern", Message: "Only char allowed." }
            ]
        };
    }


    selectChangecountry(obj: any) {
        console.log(obj);
        //this.talukaId=obj.value
    }

    onClear(val: boolean) {
        this.myForm.reset();
        this.dialogRef.close(val);
    }
}
