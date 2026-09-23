import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { DietcategoryMasterService } from '../dietcategory-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-dietcategory-master',
  templateUrl: './new-dietcategory-master.component.html',
  styleUrls: ['./new-dietcategory-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewDietcategoryMasterComponent implements OnInit {
  myForm: FormGroup;
  IsActive: boolean = true;
  dietcategoryid = 0;
  constructor(
    public _dietCategoryMasterService: DietcategoryMasterService,
    public dialogRef: MatDialogRef<NewDietcategoryMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._dietCategoryMasterService.createDietCategoryForm();
    this.myForm.markAllAsTouched();

    if ((this.data?.dietCategoryId ?? 0) > 0) {
      this.dietcategoryid = this.data.dietCategoryId
      this.IsActive = this.data.isActive
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      this._dietCategoryMasterService.dietCategorySave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Diet Category Form: ${controlName}`);
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
      categoryName: [
        { name: "required", Message: "Category Name is required" },
        { name: "maxlength", Message: "Category Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      // CategoryCode: [
      //   { name: "required", Message: "Category Code is required" }
      // ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
