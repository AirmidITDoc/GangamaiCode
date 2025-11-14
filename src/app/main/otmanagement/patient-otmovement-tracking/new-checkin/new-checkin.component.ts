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
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';

@Component({
  selector: 'app-new-checkin',
  templateUrl: './new-checkin.component.html',
  styleUrls: ['./new-checkin.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
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
  autocompleteModeFromDepartment: string = "Room";
  autocompleteModeDoctor: String = "ConDoctor";
  autocompleteModeToDepartment: String = "OttableMaster";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModeOfTransfer: string = "ModeOfTransfer";
  registerObj1 = new OtReserInsert({});
  registerObj2 = new OtReserInsert({});
  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vIPDNo: any;
  vreservationId: any;
  opIpId: any;
  vSelectedOption: any = 'OP';

  constructor(
    public _PatientOtMoveTrackingService: PatientOtmovementTrackingService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PatientOtmovementTrackingComponent>,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.CheckInFormGroup = this._PatientOtMoveTrackingService.createCheckInForm();
    this.CheckInFormGroup.markAllAsTouched();

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._PatientOtMoveTrackingService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
          });
        }, 500);
      }


      if (this.registerObj1?.estimateTime) {
        const date = new Date(this.registerObj1.estimateTime);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          const formattedTime = `${hours}:${minutes}`; // e.g. "13:01"

          setTimeout(() => {
            this.CheckInFormGroup.get('estimateTime')?.setValue(formattedTime);
          });
        }
      }

      this.CheckInFormGroup.patchValue(this.registerObj1);
    }
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
