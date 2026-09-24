import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FoodItemmasterService } from '../food-itemmaster.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-fooditem-master',
  templateUrl: './new-fooditem-master.component.html',
  styleUrls: ['./new-fooditem-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewFooditemMasterComponent implements OnInit {

  myForm: FormGroup;
  isVegetarian: boolean = true;
  FoodItemId = 0;
  autocompleteModeFoodCategory: string = 'MFoodCategoryMaster'
  autocompleteModeUnit: string = 'TypesOfFoodItemUnits'

  constructor(
    public _fooditemMasterService: FoodItemmasterService,
    public dialogRef: MatDialogRef<NewFooditemMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._fooditemMasterService.createFoodItemForm();
    this.myForm.markAllAsTouched();

    if ((this.data?.foodItemId ?? 0) > 0) {
      this.FoodItemId = this.data.foodItemId
      this.isVegetarian = this.data.isVegetarian
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      this._fooditemMasterService.foodItemSave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Food Item Form: ${controlName}`);
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
      FoodName: [
        { name: "required", Message: "Food Name is required" },
        { name: "maxlength", Message: "Food Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      // FoodCode: [
      //   { name: "required", Message: "Food Code is required" }
      // ],
      FoodCategory: [
        { name: "required", Message: "Food Category is required" }
      ],
      LocalName: [
        { name: "required", Message: "Local Name is required" }
      ],
      Unit: [
        { name: "required", Message: "Unit is required" }
      ],
      Vegeterian: [
        { name: "required", Message: "Vegeterian field is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
