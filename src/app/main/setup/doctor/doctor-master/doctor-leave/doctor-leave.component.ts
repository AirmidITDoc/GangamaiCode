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
  
   autocompleteModeleave: string = "LeaveType";

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DoctorLeaveComponent>,  public toastr: ToastrService,
    public datePipe: DatePipe,
  ) {
    this.leaveForm = this.fb.group({
      docLeaveId:0,
      doctorId:0,
      startDate:  ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      // fromTime: [''],
      // toTime: [''],
      // reason:  [''],
      leaveTypeId:["0"],
      leavetype:[''],
      leaveOptionName: [""],
       leaveOption: ["0"]
    });
  }

  leavestatus=0
   onSubmit(){
    this.leaveForm.get("startDate").setValue(this.datePipe.transform(this.leaveForm.get('startDate').value, "yyyy-MM-dd") || "01/01/1900")
    this.leaveForm.get("endDate").setValue(this.datePipe.transform(this.leaveForm.get('endDate').value, "yyyy-MM-dd") || "01/01/1900")
   this.leaveForm.get("leavetype").setValue(this.leave)
  this.leaveForm.get("leaveTypeId").setValue(this.leaveId)


    if(this.leaveForm.get("leaveOption").value==0)
      this.leaveForm.get("leaveOptionName").setValue("Full Day")
    else  if(this.leaveForm.get("leaveOption").value==1)
      this.leaveForm.get("leaveOptionName").setValue("Half Day")
     else  if(this.leaveForm.get("leaveOption").value==2)
      this.leaveForm.get("leaveOptionName").setValue("Second Half Day")

   

debugger

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
leaveId=0
leave:any;

  getSelectedqleaveObj(event){
    this.leaveId=event.value
    this.leave=event.text
  }

  onClose(){
    this.dialogRef.close()
  }
}

export class LeaveDetail {
  docLeaveId: any;
  doctorId:any;
  startDate: any;
  endDate: any;
  leaveType: any;
  leaveTypeId: any;
  leaveOptionName: any;
  leaveOption: any;
  reason: any;
  /**
   * Constructor
   *
   * @param LeaveDetail
   */

  constructor(LeaveDetail) {
    {
      this.docLeaveId = LeaveDetail.docLeaveId || 0;
       this.doctorId = LeaveDetail.doctorId || 0;
      this.startDate = LeaveDetail.startDate || '';
      this.endDate = LeaveDetail.endDate || '';
      this.leaveTypeId = LeaveDetail.leaveTypeId || '';
      this.leaveType = LeaveDetail.leaveType || '';
      this.leaveOption = LeaveDetail.leaveOption || '';
      this.reason = LeaveDetail.reason || '';
this.leaveOptionName = LeaveDetail.leaveOptionName || '';


    }
  }
}