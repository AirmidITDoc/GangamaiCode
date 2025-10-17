import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { PatientOtmovementTrackingService } from '../patient-otmovement-tracking.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PatientOtmovementTrackingComponent } from '../patient-otmovement-tracking.component';

@Component({
  selector: 'app-new-checkin',
  templateUrl: './new-checkin.component.html',
  styleUrls: ['./new-checkin.component.scss']
})
export class NewCheckinComponent {
  CheckInFormGroup: FormGroup;
  registerObj: any;
  minDate: Date;
  timeflag = 0
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  movedatetime: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  autocompleteModeDepartment: String = "Department";

  constructor(
    public _PatientOtMoveTrackingService: PatientOtmovementTrackingService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<PatientOtmovementTrackingComponent>,
    private _loggedService: AuthenticationService,
  ) { }

   ngOnInit(): void {
    this.CheckInFormGroup = this._PatientOtMoveTrackingService.createCheckInForm();
    this.CheckInFormGroup.markAllAsTouched();
  }

  onChangeDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));

      // Optional: Emit localized date and time
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);

      const isoDateString = dateOfReg.toISOString();
      this.CheckInFormGroup.get('moveDate').setValue(isoDateString);
    }
  }

  onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.CheckInFormGroup.get('moveTime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

   onSubmit() {

  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
  }
}
