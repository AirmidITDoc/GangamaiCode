import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MealtypeMasterService } from '../mealtype-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-mealtype-master',
  templateUrl: './new-mealtype-master.component.html',
  styleUrls: ['./new-mealtype-master.component.scss']
})
export class NewMealtypeMasterComponent implements OnInit {
  myForm: FormGroup;
  isActive: boolean = true;
  dietcategoryid = 0;
  constructor(
    public _mealTypeMasterService: MealtypeMasterService,
    public dialogRef: MatDialogRef<NewMealtypeMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._mealTypeMasterService.createMealTypeForm();
    this.myForm.markAllAsTouched();
    // const timeValue = this.myForm.get('dispatchTime')?.value;
    console.log(this.data)
    if ((this.data?.mealId ?? 0) > 0) {
      this.dietcategoryid = this.data.mealId
      this.isActive = this.data.active,
        this.myForm.patchValue({
          mealId: this.data.mealId,
          mealTypeCode: this.data.mealTypeCode,
          mealName: this.data.mealName,
          mealSequence: this.data.mealSequence,

          dispatchTime: this.formatTime(this.data.dispatchTime),
          preparationStartTime: this.formatTime(this.data.preparationStartTime),
          orderCutoffTime: this.formatTime(this.data.orderCutoffTime),
          defaultTime: this.formatTime(this.data.defaultTime),

          active: this.data.active
        });
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      console.log(this.myForm.value)
      this._mealTypeMasterService.mealTypeSave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Meal Type Form: ${controlName}`);
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
      MealName: [
        { name: "required", Message: "Meal Name is required" },
        { name: "maxlength", Message: "MealName should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      MealTypeCode: [
        { name: "required", Message: "Meal Type Code is required" }
      ],
      MealSequence: [
        { name: "required", Message: "Meal Sequence is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }

  formatTime(time: string): string {
    if (!time) return '';

    return time.substring(11, 16);
  }
}
