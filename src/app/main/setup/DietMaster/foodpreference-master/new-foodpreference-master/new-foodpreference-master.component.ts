import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FoodpreferenceMasterService } from '../foodpreference-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-foodpreference-master',
  templateUrl: './new-foodpreference-master.component.html',
  styleUrls: ['./new-foodpreference-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewFoodpreferenceMasterComponent implements OnInit {
  myForm: FormGroup;
  // isActive: boolean = true;
  FoodPreferenceId = 0;

  constructor(
    public _foodPrefMasterService: FoodpreferenceMasterService,
    public dialogRef: MatDialogRef<NewFoodpreferenceMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._foodPrefMasterService.createFoodPreferenceForm();
    this.myForm.markAllAsTouched();

    if ((this.data?.foodPreferenceId ?? 0) > 0) {
      this.FoodPreferenceId = this.data.foodPreferenceId
      // this.isActive = this.data.active
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      this._foodPrefMasterService.FoodPreferenceSave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Food Preference Form: ${controlName}`);
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
      FoodPreferenceName: [
        { name: "required", Message: "Food Preference Name is required" },
        { name: "maxlength", Message: "Food Preference Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      // FoodPreferenceCode: [
      //   { name: "required", Message: "Food Preference Code is required" }
      // ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
