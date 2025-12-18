import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ResultEntryService } from '../result-entry.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-outsource-details',
  templateUrl: './outsource-details.component.html',
  styleUrls: ['./outsource-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OutsourceDetailsComponent {

  LabFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  outSourceId = 0;
  outSourceStatus = 1;
  date: any;
  date1: any;
  LabName = '';
  vPathReportId: any;
  timeflag = 0
  timeflag1 = 0
  isTimeChanged: boolean = false;
  isTimeChanged1: boolean = false;
  isDatePckrDisabled: boolean = false;
  isDatePckrDisabled1: boolean = false;
  movedatetime: any;
  movedatetime1: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  autocompleteModeoutsource: string = "OutsourceLab";
  constructor(
    public _SampleService: ResultEntryService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<OutsourceDetailsComponent>,
    private router: Router
  ) { }

  Reportdatestatus = false
  isDateReadonly = false;
  isDateReadonlyUpdate = false;
  ngOnInit(): void {
    console.log(this.data);
    this.LabFormGroup = this.createLabForm();
    this.LabFormGroup.markAllAsTouched();
    var now = new Date();
    var now1 = new Date()
    // debugger
    if (this.data) {
      this.vPathReportId = this.data.pathReportId
      this.outSourceId = this.data.outSourceId || 0;
      this.LabName = this.data.outSourceLabName;
      this.outSourceStatus = this.data.outSourceStatus;
      this.LabFormGroup.get('outSourceLabName').setValue(this.outSourceId)
      if (this.outSourceId > 0) {
        this.isDateReadonlyUpdate = true
        this.date1 = now1.toISOString().slice(0, 16);
      }
    }

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now1.setMinutes(now1.getMinutes() - now1.getTimezoneOffset());
    // this.date = now.toISOString().slice(0, 16);

    debugger
    if (this.data.outSourceSampleSentDateTime != undefined) {
      this.date = this.getLocalDateTimeForInput(
        this.data.outSourceSampleSentDateTime
      );
      // this.date = new Date(this.data.outSourceSampleSentDateTime).toISOString().slice(0, 16)
      this.isDateReadonly = true;
      this.isDateReadonlyUpdate = true;
      this.combineDateAndTimeUpdateOnSave();
    }
    else {
      // this.date = new Date().toISOString().slice(0, 16)
      this.date = this.getLocalDateTime();
      this.isDateReadonly = false;
      this.isDateReadonlyUpdate = false;
      this.combineDateAndTimeOnSave();
    }
  }

  getLocalDateTime(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // offset in ms
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }

  createLabForm() {
    const now = new Date();
    const defaultTime = now.toTimeString().slice(0, 5);
    return this.formBuilder.group({
      pathReportId: [this.vPathReportId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      outSourceId: [this.outSourceId],
      outSourceLabName: [this.LabName, [Validators.required]],
      outSourceSampleSentDateTime: [''],
      outSourceStatus: [1],
      outSourceReportCollectedDateTime: ['1900-01-01 00:00:00.000'],
      outSourceCreatedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      outSourceCreatedDateTime: [new Date().toISOString()],
      outSourceModifiedby: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      outSourceModifiedDateTime: [new Date().toISOString()],
      date: [new Date()],
      time: [now]
    });
  }

  onChangeLab(e) {
    console.log(e)
    this.outSourceId = e.value
    this.LabName = e.text
  }

  getLocalDateTimeForInput(dateValue: string): string {
    const d = new Date(dateValue);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  getLocalDateTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  finalDateTime: any;
  finalDateTime1: any;
  isoDateTime1st: any;
  isoDateTime1: any;
  combineDateAndTimeOnSave() {
    debugger
    const date: Date | null = this.LabFormGroup.get('date')?.value;
    const time: Date | null = this.LabFormGroup.get('time')?.value;

    this.finalDateTime = Date;

    if (date && time) {
      this.finalDateTime = new Date(date);
      this.finalDateTime.setHours(
        time.getHours(),
        time.getMinutes(),
        0,
        0
      );
    } else {
      this.finalDateTime = new Date();
    }
    this.isoDateTime1st = this.getLocalDateTimeString(this.finalDateTime);
    this.LabFormGroup.get('outSourceSampleSentDateTime')?.setValue(this.isoDateTime1st);
  }

  combineDateAndTimeUpdateOnSave() {
    debugger
    const date: Date | null = this.LabFormGroup.get('date')?.value;
    const time: Date | null = this.LabFormGroup.get('time')?.value;

    this.finalDateTime1 = Date;

    if (date && time) {
      this.finalDateTime1 = new Date(date);
      this.finalDateTime1.setHours(
        time.getHours(),
        time.getMinutes(),
        0,
        0
      );
    } else {
      this.finalDateTime1 = new Date();
    }
    this.isoDateTime1 = this.getLocalDateTimeString(this.finalDateTime1);
    this.LabFormGroup.get('outSourceReportCollectedDateTime')?.setValue(this.isoDateTime1);
  }

  onSubmit() {

    if (this.LabFormGroup.get('outSourceStatus').value)
      this.LabFormGroup.get('outSourceStatus').setValue(1)
    else
      this.LabFormGroup.get('outSourceStatus').setValue(0)

    debugger
    // if (this.outSourceId == 0) {
    //   this.LabFormGroup.get('outSourceReportCollectedDateTime').setValue("01/01/1900")
    // }
    // else {
    this.LabFormGroup.get('outSourceReportCollectedDateTime').setValue(this.isoDateTime1)
    // this.LabFormGroup.get('outSourceReportCollectedDateTime')?.setValue('1900-01-01 00:00:00.000');
    // }

    if (this.data.outSourceSampleSentDateTime != undefined) {
      this.LabFormGroup.get('outSourceSampleSentDateTime')?.setValue(this.date);
    } else {
      this.LabFormGroup.get('outSourceSampleSentDateTime')?.setValue(this.isoDateTime1st);
    }

    this.LabFormGroup.get('outSourceLabName').setValue(this.LabName)

    if (!this.LabFormGroup.invalid) {
      this.LabFormGroup.removeControl('date');
      this.LabFormGroup.removeControl('time')
      console.log(this.LabFormGroup.value)

      this._SampleService.updatelabourMaster(this.LabFormGroup.value).subscribe((response) => {
        this._matDialog.closeAll()
      });
    } else {
      let invalidFields = [];

      if (this.LabFormGroup.invalid) {
        for (const controlName in this.LabFormGroup.controls) {
          if (this.LabFormGroup.controls[controlName].invalid) {
            invalidFields.push(`Lab Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  selectedTime: any;
  onChangeTime(event: any) {
    this.timeflag = 1;

    if (event) {
      this.selectedTime = new Date(event);

      const localeString = this.selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged = true;
      this.movedatetime = timePart;

      this.eventEmitForParent(datePart, timePart);
      this.combineDateAndTimeOnSave();
    }
  }
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  onChangeTime1(event: any) {
    this.timeflag1 = 1;

    if (event) {
      this.selectedTime = new Date(event);

      const localeString = this.selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const [datePart, timePart] = localeString.split(',').map(part => part.trim());

      this.isTimeChanged1 = true;
      this.movedatetime1 = timePart;

      this.eventEmitForParent1(datePart, timePart);
      this.combineDateAndTimeUpdateOnSave();
    }
  }
  eventEmitForParent1(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.dialogRef.close();
  }

}

