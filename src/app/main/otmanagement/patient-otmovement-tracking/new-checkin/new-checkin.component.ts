import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { PatientOtmovementTrackingService } from '../patient-otmovement-tracking.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PatientOtmovementTrackingComponent } from '../patient-otmovement-tracking.component';
import { OtReserInsert } from '../../ot-reservation/ot-reservation.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

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
  registerObj3 = new OtReserInsert({});
  vRegNo: any;
  vPatientName: any;
  vOPDNo: any;
  vIPDNo: any;
  vreservationId: any;
  opIpId: any;
  vSelectedOption: any = 'OP';
  vCheckinId: any;
  opipType = 0
  constructor(
    public _PatientOtMoveTrackingService: PatientOtmovementTrackingService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PatientOtmovementTrackingComponent>,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.CheckInFormGroup = this._PatientOtMoveTrackingService.createCheckInForm();
    this.CheckInFormGroup.markAllAsTouched();

    if ((this.data?.otReservationId) > 0) {
      this.registerObj1 = this.data
      // console.log(this.registerObj1)
      this.vRegNo = this.registerObj1.regNo
      this.vOPDNo = this.registerObj1.opdNo
      this.vIPDNo = this.registerObj1.opdNo
      this.vPatientName = this.registerObj1.patientName
      this.vCheckinId = this.registerObj1.otCheckInId

    


      const timeOnly = new Date();
      this.CheckInFormGroup.get("otcheckInTime")?.setValue(timeOnly);

      if (this.data.otReservationId) {
        setTimeout(() => {
          this._PatientOtMoveTrackingService.getotReservationById(this.data.otReservationId).subscribe((response) => {
            this.registerObj2 = response;
            // console.log("Get Data:", this.registerObj2)
            this.vreservationId = this.registerObj2.otreservationId
            this.opIpId = this.registerObj2.opipid
            this.vSelectedOption = this.registerObj2.opiptype == 0 ? 'OP' : 'IP';
          });
        }, 500);
      }

      if (this.data.otCheckInId) {
        setTimeout(() => {
          this._PatientOtMoveTrackingService.getotcheckInOutById(this.data.otCheckInId).subscribe((response) => {
            this.registerObj3 = response;

            const tempObj = { ...this.registerObj3 };
            delete tempObj.otcheckInTime;

            Object.keys(tempObj).forEach(key => {
              if (this.CheckInFormGroup.contains(key)) {
                this.CheckInFormGroup.get(key)?.patchValue(tempObj[key]);
              }
            });

            if (this.registerObj3.otcheckInTime) {
              const timePart = this.registerObj3.otcheckInTime.split(" ")[1];
              const [hours, minutes, seconds] = timePart.split(":").map(Number);
              const timeOnly = new Date();
              timeOnly.setHours(hours, minutes, seconds || 0, 0);
              this.CheckInFormGroup.get("otcheckInTime")?.setValue(timeOnly);
            }
            console.log("Get CheckIN Data:", this.registerObj3)
          });
        }, 500);
      }
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
        .toLocaleString("en-US")
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);

      const isoDateString = dateOfReg.toISOString();
      this.CheckInFormGroup.get('otcheckInDate').setValue(isoDateString);
    }
  }

  onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      const selectedTime = new Date(event);

      const localeString = selectedTime.toLocaleString("en-US");
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.CheckInFormGroup.get('otcheckInTime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  getCurrentTime(): Date {
    const now = new Date();
    now.setSeconds(0);    // optional, remove seconds
    return now;
  }

  onSubmit() {
    const currentTime = this.getCurrentTime();
    const inDate = this.datePipe.transform(this.CheckInFormGroup.get('otcheckInDate')?.value, 'yyyy-MM-dd');
    const inTime = this.datePipe.transform(this.CheckInFormGroup.get('otcheckInTime')?.value, 'HH:mm:ss');
    if (inDate && inTime) {
      const combinedDateTime = new Date(`${inDate}T${inTime}`); //`${inDate} ${inTime}`;
      this.CheckInFormGroup.get('otcheckInTime')?.setValue(combinedDateTime);
    }
    this.CheckInFormGroup.get('otcheckInDate')?.setValue(inDate);
    this.CheckInFormGroup.get('otreservationId')?.setValue(this.vreservationId);
    this.CheckInFormGroup.get('opipid')?.setValue(this.opIpId);
    this.CheckInFormGroup.get('opiptype')?.setValue(this.vSelectedOption == 'IP' ? true : false);
    this.CheckInFormGroup.get('otcheckInId')?.setValue(this.vCheckinId || 0);
    this.CheckInFormGroup.get('checkOutTime')?.setValue(currentTime);

    if (this.vCheckinId > 0) {
      this.CheckInFormGroup.get('checkInOut')?.setValue(0);
      // this.CheckInFormGroup.get('checkOutTime')?.setValue(currentTime);
      this.CheckInFormGroup.get('checkOutFromDepartment')?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
      this.CheckInFormGroup.get('checkOutToDepartment')?.setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
      this.CheckInFormGroup.get('checkOutFromDepartment')?.updateValueAndValidity();
      this.CheckInFormGroup.get('checkOutToDepartment')?.updateValueAndValidity();
    }

    console.log(this.CheckInFormGroup.value)
    if (!this.CheckInFormGroup.invalid) {
      this._PatientOtMoveTrackingService.CheckINOutSave(this.CheckInFormGroup.value).subscribe((response) => {
        this.OnPrint(response)
        this.onClear(true);
      });
    } else {
      let invalidFields: string[] = [];

      const validateFormGroup = (formGroup: FormGroup | FormArray, parentKey: string = '') => {
        Object.keys(formGroup.controls).forEach(key => {
          const control = formGroup.get(key);
          const fieldKey = parentKey ? `${parentKey}.${key}` : key;

          if (control instanceof FormGroup || control instanceof FormArray) {
            validateFormGroup(control, fieldKey); // ✅ recursion for deeper levels
          } else {
            if (control?.invalid) {
              invalidFields.push(fieldKey);
            }
          }
        });
      };

      validateFormGroup(this.CheckInFormGroup);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please check this field "${field}"`, 'Warning!');
        });
        return;
      }
    }
  }



  OnPrint(element) {
    debugger
     if(this.registerObj1.opIpType)
      this.opipType = 1
    else
       this.opipType = 0
    const param = {

      "searchFields": [
        {
          "fieldName": "OPIPID",
          "fieldValue": String(this.opIpId),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(this.opipType),
          "opType": "Equals"
        },
        {
          "fieldName": "CheckInOut",
          "fieldValue": "1",
          "opType": "Equals"
        }
      ],
      mode: "OTCheckInOutPatientWise"
    };
    console.log(param)
    this._PatientOtMoveTrackingService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "OTCheckInOutPatientWise Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
    });
    // this.commonService.Onprint("AnesthesiaId", element.AnesthesiaId, "OTAnaesthesiaRecord");

  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
  }
}
