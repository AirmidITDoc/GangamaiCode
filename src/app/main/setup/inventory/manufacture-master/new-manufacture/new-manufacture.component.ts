import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ManufactureMasterService } from '../manufacture-master.service';

@Component({
  selector: 'app-new-manufacture',
  templateUrl: './new-manufacture.component.html',
  styleUrls: ['./new-manufacture.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewManufactureComponent implements OnInit {

  manufForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _ManufactureMasterService: ManufactureMasterService,
    public dialogRef: MatDialogRef<NewManufactureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.manufForm = this._ManufactureMasterService.createManufactureForm();
    this.manufForm.markAllAsTouched();
    if ((this.data?.manufId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.manufForm.patchValue(this.data);
    }
  }


  onSubmit() {

    if (!this.manufForm.invalid) {
      console.log(this.manufForm.value)
      this._ManufactureMasterService.manufactureMasterSave(this.manufForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.manufForm.invalid) {
        for (const controlName in this.manufForm.controls) {
          if (this.manufForm.controls[controlName].invalid) {
            invalidFields.push(`manuf Form: ${controlName}`);
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
  onClear(val: boolean) {
    this.manufForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      manufName: [
        { name: "required", Message: "Manufacture Name is required" },
        { name: "maxlength", Message: "Manufacture Name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ],
      manufShortName: [
        { name: "required", Message: "Manufacture Short Name is required" },
        { name: "maxlength", Message: "Manufacture Short Name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }

}
