import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { PrescriptionclassmasterService } from '../prescriptionclassmaster.service';

@Component({
  selector: 'app-new-prescription-class',
  templateUrl: './new-prescription-class.component.html',
  styleUrls: ['./new-prescription-class.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewPrescriptionClassComponent implements OnInit {

  prescriptionForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _PrescriptionclassService: PrescriptionclassmasterService,
    public dialogRef: MatDialogRef<NewPrescriptionClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.prescriptionForm = this._PrescriptionclassService.createPrescriptionclassForm();
    this.prescriptionForm.markAllAsTouched();

    if ((this.data?.classId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.prescriptionForm.patchValue(this.data);
    }
  }


  onSubmit() {

    if (!this.prescriptionForm.invalid) {
      console.log(this.prescriptionForm.value)
      this._PrescriptionclassService.prescriptionClassMasterSave(this.prescriptionForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.prescriptionForm.invalid) {
        for (const controlName in this.prescriptionForm.controls) {
          if (this.prescriptionForm.controls[controlName].invalid) {
            invalidFields.push(`prescription Form: ${controlName}`);
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
    this.prescriptionForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      className: [
        { name: "required", Message: "Class Name is required" },
        { name: "maxlength", Message: "Class Name should not be greater than 50 char." },
        { name: "pattern", Message: "Special Char Not Allowed." }
      ],
      templateDescName: [
        { name: "required", Message: "Class Name is required" },
      ]
    };
  }
}
