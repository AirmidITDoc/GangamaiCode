import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { DatePipe } from '@angular/common';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { MatTableDataSource } from '@angular/material/table';
import { PatientTemporaryMovementService } from '../patient-temporary-movement.service';
import { OtReqInsert } from '../../ot-request/ot-request.component';

@Component({
  selector: 'app-new-patient-temporary-movement',
  templateUrl: './new-patient-temporary-movement.component.html',
  styleUrls: ['./new-patient-temporary-movement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPatientTemporaryMovementComponent {

  screenFromString = 'Common-form';
  patientTemMoveFormGroup: FormGroup;
  registerObj: any;
  vRegNo: any;
  vPatientName: any;
  vbookingId: any;
  vOPDNo: any;
  vIPDNo: any;
  opIpId: any;
  vSelectedOption: any = "OP";
  registerObj1 = new OtReqInsert({});
  dateTimeObj: any;
  opIpType: number;
  timeflag = 0
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  movedatetime: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  autocompleteModeDepartment: String = "Department";
  minDate: Date;

  constructor(
    public _PatientTemMoveService: PatientTemporaryMovementService,
    public dialogRef: MatDialogRef<NewPatientTemporaryMovementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public _AdmissionService: AdmissionService,
    public datePipe: DatePipe,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.patientTemMoveFormGroup = this._PatientTemMoveService.createPatienttemMoveForm();
    this.patientTemMoveFormGroup.markAllAsTouched();

    if ((this.data?.otBookingId) > 0) {
      this.registerObj = this.data
      this.vbookingId = this.registerObj.otBookingId
      this.opIpId = this.registerObj.visitId
      this.vRegNo = this.registerObj.regNo
      this.vOPDNo = this.registerObj.opdNo
      this.vIPDNo = this.registerObj.opdNo
      this.vPatientName = this.registerObj.patientName

      if (this.registerObj.opIpType == 0) {
        this.vSelectedOption = "OP"
      }
      else {
        this.vSelectedOption = "IP"
      }

      console.log(this.registerObj)
      this.patientTemMoveFormGroup.patchValue(this.registerObj);
    }

    this.patientTemMoveFormGroup.get('extraRemark').disable();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  onChangeReg(event) {
    if (event.value == 'OP') {
      this.opIpType = 0;
      this.opIpId = "";
    }
    else if (event.value == 'IP') {
      this.opIpType = 1;
      this.opIpId = "";
    }
    this.patientInfoReset();
  }

  patientInfoReset() {
    this.patientTemMoveFormGroup.get('opIpId').setValue('');
    this.patientTemMoveFormGroup.get('opIpId').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vIPDNo = '';

    this.registerObj1 = new OtReqInsert({});
  }

  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.registerObj1 = obj
      console.log("Admitted patient:", this.registerObj1)
      this.vRegNo = obj.regNo
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vIPDNo = obj.ipdNo
      this.opIpId = obj.admissionID;
    }
  }
  getSelectedObjOP(obj) {
    if ((obj.regId ?? 0) > 0) {
      this.registerObj1 = obj
      console.log("Visite Patient:", this.registerObj1)
      this.vRegNo = obj.regNo
      this.vOPDNo = obj.opdNo
      let nameField = obj.formattedText;
      let extractedName = nameField.split('|')[0].trim();
      this.vPatientName = extractedName;
      this.opIpId = obj.visitId;
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
      this.patientTemMoveFormGroup.get('moveDate').setValue(isoDateString);
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

      this.patientTemMoveFormGroup.get('moveTime').setValue(selectedTime);

      this.eventEmitForParent(datePart, timePart);
    }
  }
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  toggleExtra(event: any) {
  const control = this.patientTemMoveFormGroup.get('extraRemark');

  if (event.checked) {
    control.enable(); // enable when checked
  } else {
    control.disable(); // disable when unchecked
    control.setValue(''); // clear the text
  }
}

  onSubmit() {

  }

  onClear(val: boolean) {

    this.dialogRef.close(val);
    // this.patientTemMoveFormGroup.get('opIpType').setValue('OP')
  }
}
