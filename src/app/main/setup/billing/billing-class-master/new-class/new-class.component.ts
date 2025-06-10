import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { BillingClassMasterService } from '../billing-class-master.service';

@Component({
  selector: 'app-new-class',
  templateUrl: './new-class.component.html',
  styleUrls: ['./new-class.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewClassComponent implements OnInit {

  classForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _BillingClassMasterService: BillingClassMasterService,
    public dialogRef: MatDialogRef<NewClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.classForm = this._BillingClassMasterService.createClassForm();
    this.classForm.markAllAsTouched();
    if ((this.data?.classId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.classForm.patchValue(this.data);
    }
  }
  onSubmit() {

    if (!this.classForm.invalid) {
      console.log(this.classForm.value)
      this._BillingClassMasterService.classMasterSave(this.classForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.classForm.invalid) {
        for (const controlName in this.classForm.controls) {
          if (this.classForm.controls[controlName].invalid) {
            invalidFields.push(`class Form: ${controlName}`);
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
    this.classForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      className: [
        { name: "required", Message: "Class Name is required" },
        { name: "maxlength", Message: "Class name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }

}
