import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { EmployeeDepartmentService } from '../employee-department.service';

@Component({
  selector: 'app-new-employee-department',
  templateUrl: './new-employee-department.component.html',
  styleUrls: ['./new-employee-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewEmployeeDepartmentComponent {

  EmpDepForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _EmpDepService: EmployeeDepartmentService,
    public dialogRef: MatDialogRef<NewEmployeeDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.EmpDepForm = this._EmpDepService.createForm();
    this.EmpDepForm.markAllAsTouched();
    if ((this.data?.empDepartmentId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.EmpDepForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.EmpDepForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    } else {
      if (this.EmpDepForm.valid) {

        console.log("JSON :-", this.EmpDepForm.value);

        this._EmpDepService.empDepSave(this.EmpDepForm.value).subscribe((response) => {
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    }
  }

   onClear(val: boolean) {
        this.EmpDepForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            empDepartmentName: [
                { name: "required", Message: "Department Name is required" },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
