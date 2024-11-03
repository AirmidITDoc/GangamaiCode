import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DoctortypeMasterService } from '../doctortype-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-doctor-type',
  templateUrl: './new-doctor-type.component.html',
  styleUrls: ['./new-doctor-type.component.scss']
})
export class NewDoctorTypeComponent implements OnInit {

  doctortypeForm: FormGroup;
  constructor(
      public _DoctortypeMasterService: DoctortypeMasterService,
      public dialogRef: MatDialogRef<NewDoctorTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.doctortypeForm = this._DoctortypeMasterService.createDoctortypeForm();
      var m_data = {
        id: this.data?.id,
        doctorType: this.data?.doctorType.trim(),
       isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.doctortypeForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.doctortypeForm.valid) {
        debugger
          this._DoctortypeMasterService.doctortypeMasterSave(this.doctortypeForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.doctortypeForm.reset();
      this.dialogRef.close(val);
  }
}
