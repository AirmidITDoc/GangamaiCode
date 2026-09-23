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

    console.log(this.data)
    if ((this.data?.dietTypeId ?? 0) > 0) {
      this.DietTypeId = this.data.dietTypeId
      this.isActive = this.data.isActive
      this.myForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.myForm.invalid) {
      console.log(this.myForm.value)
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
      DietCode: [
        { name: "required", Message: "Diet Code is required" }
      ],
      DietCategoryId: [
        { name: "required", Message: "Diet Category is required" }
      ],
      DisplayOrder: [
        { name: "required", Message: "Display Order is required" }
      ],
      DefaultCalories: [
        { name: "required", Message: "Defalut Calories is required" }
      ],
      DefalutProtein: [
        { name: "required", Message: "Defalut Protein is required" }
      ],
      DefalutFluid: [
        { name: "required", Message: "Defalut Fluid is required" }
      ],
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }

}
