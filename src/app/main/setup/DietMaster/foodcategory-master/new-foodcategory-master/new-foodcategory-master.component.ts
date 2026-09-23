import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FoodcategoryMasterService } from '../foodcategory-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-foodcategory-master',
  templateUrl: './new-foodcategory-master.component.html',
  styleUrls: ['./new-foodcategory-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewFoodcategoryMasterComponent implements OnInit{
  myForm: FormGroup;
  FoodCategoryId = 0;
  constructor(
    public _foodCategoryMasterService: FoodcategoryMasterService,
    public dialogRef: MatDialogRef<NewFoodcategoryMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._foodCategoryMasterService.createFoodCategoryForm();
    this.myForm.markAllAsTouched();

    console.log(this.data)
    if ((this.data?.foodCategoryId ?? 0) > 0) {
      this.FoodCategoryId = this.data.foodCategoryId
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      console.log(this.myForm.value)
      this._foodCategoryMasterService.foodCategorySave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Food Category Form: ${controlName}`);
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
      FoodCategoryName: [
        { name: "required", Message: "Food Category Name is required" },
        { name: "maxlength", Message: "Food Category Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      FoodCategoryCode: [
        { name: "required", Message: "Food Category Code is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
