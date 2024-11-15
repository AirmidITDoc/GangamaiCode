import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentlistService } from '../appointmentlist.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-consultant-doctor',
  templateUrl: './edit-consultant-doctor.component.html',
  styleUrls: ['./edit-consultant-doctor.component.scss']
})
export class EditConsultantDoctorComponent implements OnInit {

  ConsdrForm: FormGroup;
  constructor(
      public _AppointmentlistService: AppointmentlistService,
      public dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public datePipe: DatePipe,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.ConsdrForm = this._AppointmentlistService.createConsultatDrForm();
      var m_data = {
        doctorID: this.data?.doctorID,
        departmentid: this.data?.departmentid,
        // roomId: this.data?.roomId,
        // isAvailible: JSON.stringify(this.data?.isAvailible),
         // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.ConsdrForm.patchValue(m_data);
  }

 
  onSubmit() {
      // if (this.ConsdrForm.valid) {
        debugger
        var m_data={
          "visitId": 0,
          "regId": 0,
          "consultantDocId":this.ConsdrForm.get("DoctorID").value || 0,
           "departmentId": this.ConsdrForm.get("Departmentid").value || 0
        }
          this._AppointmentlistService.EditConDoctor(m_data).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      // }
  }

  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
  }


  onClear(val: boolean) {
      this.ConsdrForm.reset();
      this.dialogRef.close(val);
  }

  onClose(){
    this.dialogRef.close();
  }
}
