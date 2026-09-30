import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { DiettypeMasterService } from '../diettype-master.service';

@Component({
  selector: 'app-new-diettype-master',
  templateUrl: './new-diettype-master.component.html',
  styleUrls: ['./new-diettype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewDiettypeMasterComponent {
  myForm: FormGroup;
  isActive: boolean = true;
  DietTypeId = 0;
  dietCategoryId: any;
  autocompleteModeDietCategory: string = 'MDietCategoryMaster'

  constructor(
    public _diettypeMasterService: DiettypeMasterService,
    public dialogRef: MatDialogRef<NewDiettypeMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._diettypeMasterService.createDietTypeForm();
    this.myForm.markAllAsTouched();

    // if ((this.data?.dietTypeId ?? 0) > 0) {
    //   this.DietTypeId = this.data.dietTypeId
    //   this.isActive = this.data.isActive
    //   this.dietCategoryId = this.data.dietCategoryId
    //   // this.myForm.patchValue(this.data);
    //   this.myForm.patchValue(
    //     {
    //       ...this.data,
    //       dietCategoryId: this.data.dietCategoryId
    //     }
    //   );
    //   console.log("MyForm", this.data)
    // }
    if ((this.data?.dietTypeID ?? 0) > 0) {

      this.DietTypeId = this.data.dietTypeID;
      this.isActive = this.data.active;
      this.dietCategoryId = this.data.dietCategoryId;

      this.myForm.patchValue({
        dietCategoryId: this.data.dietCategoryId,
        dietName: this.data.dietName,
        dietCode: this.data.dietCode,
        shortName: this.data.shortName,
        description: this.data.description,
        defaultCalories: this.data.defaultCalories,
        defaultProtein: this.data.defaultProtein,
        defaultFluid: this.data.defaultFluid,
        active: this.data.active,
        displayOrder: this.data.displayOrder,
        remarks: this.data.remarks
      });
    }
  }

  onSubmit() {
    if (!this.myForm.invalid) {
      this._diettypeMasterService.dietTypeSave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Diet Type Form: ${controlName}`);
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
      DietName: [
        { name: "required", Message: "Diet Name is required" },
        { name: "maxlength", Message: "Diet Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      DietCategoryId: [
        { name: "required", Message: "Diet Category is required" }
      ],
      // DefaultCalories: [
      //   { name: "required", Message: "Defalut Calories is required" }
      // ],
      // DefalutProtein: [
      //   { name: "required", Message: "Defalut Protein is required" }
      // ],
      // DefalutFluid: [
      //   { name: "required", Message: "Defalut Fluid is required" }
      // ],
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }

}
