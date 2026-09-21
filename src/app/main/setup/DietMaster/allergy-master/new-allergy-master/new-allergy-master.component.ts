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
  IsActive: boolean = true;
  AllergyId = 0;
  autocompleteModeAllergy = "MFoodCategoryMaster"

  constructor(
    public _allergyMasterService: AllergyMasterService,
    public dialogRef: MatDialogRef<NewAllergyMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._allergyMasterService.createAllergyForm();
    this.myForm.markAllAsTouched();

    console.log(this.data)
    if ((this.data?.allergyId ?? 0) > 0) {
      this.AllergyId = this.data.allergyId
      this.IsActive = this.data.active
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      console.log(this.myForm.value)
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
        { name: "required", Message: "AllergyName is required" },
        { name: "maxlength", Message: "AllergyName should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      AllergyCode: [
        { name: "required", Message: "AllergyCode is required" }
      ],
      CategoryId: [
        { name: "required", Message: "Category is required" }
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
