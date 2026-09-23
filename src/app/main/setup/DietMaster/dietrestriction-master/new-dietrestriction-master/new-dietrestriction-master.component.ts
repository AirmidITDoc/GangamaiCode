import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { DietrestrictionMasterService } from '../dietrestriction-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-dietrestriction-master',
  templateUrl: './new-dietrestriction-master.component.html',
  styleUrls: ['./new-dietrestriction-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewDietrestrictionMasterComponent implements OnInit {
  myForm: FormGroup;
  isActive: boolean = true;
  RestrictionId = 0;
  autocompleteModeDietRestriction: string = 'DietRestriction'

  constructor(
    public _dietResMasterService: DietrestrictionMasterService,
    public dialogRef: MatDialogRef<NewDietrestrictionMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._dietResMasterService.createRestrictionForm();
    this.myForm.markAllAsTouched();

    if ((this.data?.restrictionId ?? 0) > 0) {
      this.RestrictionId = this.data.restrictionId
      this.isActive = this.data.active
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      this._dietResMasterService.DietRestrictionSave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Diet Restriction Form: ${controlName}`);
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
      RestrictionName: [
        { name: "required", Message: "Restriction Name is required" },
        { name: "maxlength", Message: "Restriction Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ],
      // RestrictionCode: [
      //   { name: "required", Message: "Restriction Code is required" }
      // ],
      RestrictionTypeId: [
        { name: "required", Message: "Restriction Type is required" }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
