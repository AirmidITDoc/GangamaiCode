import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoctorChargesComponent } from '../doctor-charges/doctor-charges.component';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctor-leave',
  templateUrl: './doctor-leave.component.html',
  styleUrls: ['./doctor-leave.component.scss'],
    encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class DoctorLeaveComponent {
leaveForm: FormGroup;
  
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DoctorLeaveComponent>,  public toastr: ToastrService,
    public datePipe: DatePipe,
  ) {
    this.leaveForm = this.fb.group({
      fromDate:  ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      fromTime: [''],
      toTime: [''],
      reason:  ['', [Validators.required]],
      isHoliday: [false]
    });
  }


   onSubmit(){
    this.leaveForm.get("fromDate").setValue(this.datePipe.transform(this.leaveForm.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900")
    this.leaveForm.get("toDate").setValue(this.datePipe.transform(this.leaveForm.get('toDate').value, "yyyy-MM-dd") || "01/01/1900")


    console.log(this.leaveForm.value)
     if (!this.leaveForm.invalid) {
      this.dialogRef.close(this.leaveForm.value)
    } else {
      let invalidFields = [];
      if (this.leaveForm.invalid) {
        for (const controlName in this.leaveForm.controls) {
          if (this.leaveForm.controls[controlName].invalid) { invalidFields.push(`Leave Form: ${controlName}`); }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }
    }
  }

  onClose(){
    this.dialogRef.close()
  }
}

export class LeaveDetail {
  LeaveId: any;
  startDate: any;
  endDate: any;
  startTime: any;
  endTime: any;
reason: any;
  /**
   * Constructor
   *
   * @param LeaveDetail
   */

  constructor(LeaveDetail) {
    {
      this.LeaveId = LeaveDetail.LeaveId || '';
      this.startDate = LeaveDetail.startDate || '';
      this.endDate = LeaveDetail.endDate || '';
      this.startTime = LeaveDetail.startTime || '';
      this.endTime = LeaveDetail.endTime || '';
      this.reason = LeaveDetail.reason || '';


    }
  }
}