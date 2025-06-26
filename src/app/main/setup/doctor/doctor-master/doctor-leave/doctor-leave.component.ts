import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DoctorChargesComponent } from '../doctor-charges/doctor-charges.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-doctor-leave',
  templateUrl: './doctor-leave.component.html',
  styleUrls: ['./doctor-leave.component.scss'],
    encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class DoctorLeaveComponent {
leaveForm: FormGroup;
  leaveList: any[] = [];

  columns = ['fromDate', 'toDate', 'fromTime', 'toTime', 'availability', 'actions'];

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DoctorLeaveComponent>,
  ) {
    this.leaveForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      fromTime: [''],
      toTime: [''],
      reason: [''],
      isHoliday: [false]
    });
  }

  saveLeave() {
    this.leaveList.push(this.leaveForm.value);
    this.leaveForm.reset();
  }

  addLeave() {
    this.leaveForm.reset();
  }

  editLeave(leave: any) {
    this.leaveForm.patchValue(leave);
  }

   onSubmit(){

  }

  onClose(){
    this.dialogRef.close()
  }
}
