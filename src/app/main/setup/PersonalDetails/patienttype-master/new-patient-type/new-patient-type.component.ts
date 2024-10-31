import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatienttypeMasterService } from '../patienttype-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-patient-type',
  templateUrl: './new-patient-type.component.html',
  styleUrls: ['./new-patient-type.component.scss']
})
export class NewPatientTypeComponent implements OnInit {

  patienttypeForm: FormGroup;
  constructor(
      public _PatienttypeMasterService: PatienttypeMasterService,
      public dialogRef: MatDialogRef<NewPatientTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.patienttypeForm = this._PatienttypeMasterService.createPatientTypeForm();
      var m_data = {
        patientTypeId: this.data?.patientTypeId,
        patientType: this.data?.patientType.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.patienttypeForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.patienttypeForm.valid) {
          this._PatienttypeMasterService.patienttypeMasterSave(this.patienttypeForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.patienttypeForm.reset();
      this.dialogRef.close(val);
  }
}
