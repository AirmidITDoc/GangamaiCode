import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DepartmentMasterService } from '../department-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.scss']
})
export class NewDepartmentComponent implements OnInit {

  departmentForm: FormGroup;
  constructor(
      public _DepartmentMasterService: DepartmentMasterService,
      public dialogRef: MatDialogRef<NewDepartmentComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.departmentForm = this._DepartmentMasterService.createDepartmentForm();
      var m_data = {
          departmentId: this.data?.departmentId,
          departmentName: this.data?.departmentName.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.departmentForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.departmentForm.valid) {
          this._DepartmentMasterService.departmentMasterSave(this.departmentForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.departmentForm.reset();
      this.dialogRef.close(val);
  }
}
