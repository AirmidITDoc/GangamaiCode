import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DepartmentMasterService } from '../department-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewDepartmentComponent implements OnInit {

  departmentForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _DepartmentMasterService: DepartmentMasterService,
    public dialogRef: MatDialogRef<NewDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.departmentForm = this._DepartmentMasterService.createDepartmentForm();
    this.departmentForm.markAllAsTouched();
    if ((this.data?.departmentId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.departmentForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.departmentForm.invalid) {
      console.log(this.departmentForm.value)
      this._DepartmentMasterService.departmentMasterSave(this.departmentForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.departmentForm.invalid) {
        for (const controlName in this.departmentForm.controls) {
          if (this.departmentForm.controls[controlName].invalid) {
            invalidFields.push(`department Form: ${controlName}`);
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
    this.departmentForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      departmentName: [
        { name: "required", Message: "Department Name is required" },
        { name: "maxlength", Message: "Department name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }
}
