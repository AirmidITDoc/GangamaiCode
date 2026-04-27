import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { EmployeeDesignationService } from '../employee-designation.service';

@Component({
  selector: 'app-new-employee-designation',
  templateUrl: './new-employee-designation.component.html',
  styleUrls: ['./new-employee-designation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewEmployeeDesignationComponent {
  EmpDesignForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _EmpDesigService: EmployeeDesignationService,
    public dialogRef: MatDialogRef<NewEmployeeDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.EmpDesignForm = this._EmpDesigService.createForm();
    this.EmpDesignForm.markAllAsTouched();
    if ((this.data?.empDesignationId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.EmpDesignForm.patchValue(this.data);
    }
  }

   onSubmit() {
    if (this.EmpDesignForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    } else {
      if (this.EmpDesignForm.valid) {

        console.log("JSON :-", this.EmpDesignForm.value);

        this._EmpDesigService.empDesigSave(this.EmpDesignForm.value).subscribe((response) => {
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    }
  }

   onClear(val: boolean) {
        this.EmpDesignForm.reset();
        this.dialogRef.close(val);
    }

      getValidationMessages() {
        return {
            empDesignationName: [
                { name: "required", Message: "Designation Name is required" },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
