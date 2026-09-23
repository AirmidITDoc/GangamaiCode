import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AllergyMasterService } from '../allergy-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-allergy-master',
  templateUrl: './new-allergy-master.component.html',
  styleUrls: ['./new-allergy-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAllergyMasterComponent implements OnInit {
  myForm: FormGroup;
  AllergyId = 0;
  autocompleteModeAllergy = "MFoodCategoryMaster"
  isKitchenAlert: boolean = true;

  constructor(
    public _allergyMasterService: AllergyMasterService,
    public dialogRef: MatDialogRef<NewAllergyMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._allergyMasterService.createAllergyForm();
    this.myForm.markAllAsTouched();

    if ((this.data?.allergyId ?? 0) > 0) {
      this.AllergyId = this.data.allergyId
      this.isKitchenAlert = this.data.isKitchenAlert
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      this._allergyMasterService.allergySave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Allergy Master Form: ${controlName}`);
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
      AllergyName: [
        { name: "required", Message: "Allergy Name is required" },
        { name: "maxlength", Message: "Allergy Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      // AllergyCode: [
      //   { name: "required", Message: "Allergy Code is required" }
      // ],
      CategoryId: [
        { name: "required", Message: "Food Category is required" }
      ],
      SeverityId: [
        { name: "required", Message: "Severity is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
