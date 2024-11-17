import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppointmentlistService } from '../appointmentlist.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-refrance-doctor',
  templateUrl: './edit-refrance-doctor.component.html',
  styleUrls: ['./edit-refrance-doctor.component.scss']
})
export class EditRefranceDoctorComponent implements OnInit {


  RefrancedrForm: FormGroup;

  VisitId: any = 0;
  RegId: any = 0;

  autocompleteModerefdoc: string = "RefDoctor";
  constructor(
    public _AppointmentlistService: AppointmentlistService,
    public dialogRef: MatDialogRef<EditRefranceDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.RefrancedrForm = this._AppointmentlistService.createRefranceDrForm();

    if (this.data) {
      this.RegId = this.data.regId
      this.VisitId = this.data.visitId
    }

    var m_data = {
      refDoctorId: this.data?.refDoctorId,
      // departmentid: this.data?.departmentid,
      // roomId: this.data?.roomId,
      // isAvailible: JSON.stringify(this.data?.isAvailible),
      // isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.RefrancedrForm.patchValue(m_data);



  }



  onSubmit() {
    // if (this.RefrancedrForm.valid) {
    debugger
    var m_data = {
      "visitId": this.VisitId,
      "regId": this.RegId,
      "refDocId": this.RefrancedrForm.get("DoctorID").value.value || 0

    }
    console.log(m_data);
    this._AppointmentlistService.EditRefDoctor(m_data).subscribe((response) => {
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
    this.RefrancedrForm.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.dialogRef.close();
  }
  refdocId = 0
  selectChangerefdoc(obj: any) {
    console.log(obj);
    this.refdocId = obj.value
  }
}
