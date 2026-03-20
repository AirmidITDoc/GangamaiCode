import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from '../admission.component';
import { AdmissionService } from '../admission.service';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-mlcinformation',
  templateUrl: './mlcinformation.component.html',
  styleUrls: ['./mlcinformation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MLCInformationComponent implements OnInit {

  MlcInfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'Common-form';
  Personaldata = new MlcDetail({});
  registerObj = new MlcDetail({})
  AdmissionId: any;
  EmgId: any;
  public value = new Date();
  date: string;
  dateValue: any = new Date().toISOString();
  mlcid = 0;
  DetailGiven: any;
  Remark: any;

  Mlcdate: any;
  isTimeChanged: boolean = false;
  minDate: Date;
  timeflag = 0;
  public now: Date = new Date();
  dateTimeString: any;
  phdatetime: any;
  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<MLCInformationComponent>,
    private router: Router
  ) {
    this.date = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    console.log(this.data);
    this.MlcInfoFormGroup = this.createmlcForm();
    this.MlcInfoFormGroup.markAllAsTouched();

    if (this.data) {
      this.Personaldata = this.data;
      this.AdmissionId = this.Personaldata.admissionId;
      this.EmgId = this.Personaldata.emgId;

      if ((this.data?.admissionId ?? 0) > 0) {
        setTimeout(() => {
          this._AdmissionService.getMLCById(this.data.admissionId).subscribe((response) => {
            debugger
            console.log(response)
            if (response?.mlcid > 0)
              this.registerObj = response;
            this.DetailGiven = this.registerObj.detailGiven
            this.Remark = this.registerObj.remark
            this.MlcInfoFormGroup.get('reportingDate')?.setValue(this.registerObj.reportingDate);
            const backendValue = this.registerObj.reportingTime; // "19-09-2025 13:00:00"

            if (backendValue) {
              // Parse backend time
              const timePart = backendValue.split(' ')[1]; // "13:00:00"
              const [hours, minutes, seconds] = timePart.split(':').map(Number);

              const timeOnly = new Date();
              timeOnly.setHours(hours, minutes, seconds || 0, 0);

              this.MlcInfoFormGroup.get('reportingTime')?.setValue(timeOnly);
            } else {
              // No backend value → set current time
              const now = new Date();
              this.MlcInfoFormGroup.get('reportingDate')?.setValue(now);
              this.MlcInfoFormGroup.get('reportingTime')?.setValue(now);
            }
            console.log(this.registerObj)
          });
        }, 500);
      }
      // emergency patient
      if ((this.data?.emgId ?? 0) > 0) {
        setTimeout(() => {
          this._AdmissionService.getMLCById(this.data.emgId).subscribe((response) => {
            if (response?.mlcid > 0)
              this.registerObj = response;
            console.log(this.registerObj)

            this.DetailGiven = this.registerObj.detailGiven
            this.Remark = this.registerObj.remark
            this.MlcInfoFormGroup.get('reportingDate')?.setValue(this.registerObj.reportingDate);
            const backendValue = this.registerObj.reportingTime; // "19-09-2025 13:00:00"

            if (backendValue) {
              // Parse backend time
              const timePart = backendValue.split(' ')[1]; // "13:00:00"
              const [hours, minutes, seconds] = timePart.split(':').map(Number);

              const timeOnly = new Date();
              timeOnly.setHours(hours, minutes, seconds || 0, 0);

              this.MlcInfoFormGroup.get('reportingTime')?.setValue(timeOnly);
            } else {
              // No backend value → set current time
              const now = new Date();
              this.MlcInfoFormGroup.get('reportingDate')?.setValue(now);
              this.MlcInfoFormGroup.get('reportingTime')?.setValue(now);
            }

            // this.MlcInfoFormGroup.get('reportingTime')?.setValue(this.registerObj.reportingTime.toTimeString().slice(0, 5));
          });
        }, 500);
        this.MlcInfoFormGroup.get('isEmgOrAdm').setValue(true)
      }

    }
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US").split(',');
      // if (!this.isTimeChanged) {
      //   this.MlcInfoFormGroup.get('reportingTime').setValue(this.now);
      //   if (this.MlcInfoFormGroup.get('reportingTime'))
      //     this.MlcInfoFormGroup.get('reportingTime').setValue(this.now);
      // }
    }, 1);
  }

  createmlcForm() {
    return this.formBuilder.group({
      mlcid: 0,
      admissionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isEmgOrAdm: [false],
      mlcno: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      reportingDate: [(new Date()).toISOString()],
      reportingTime: ['', [Validators.required]],
      authorityName: ['', [Validators.required]],
      buckleNo: ['', [Validators.minLength(5), Validators.maxLength(7), Validators.required]],
      policeStation: ['', [Validators.required]],
      detailGiven: [''],
      remark: ['']
    });
  }

  onSubmit() {
    debugger

    const selectedDate = this.datePipe.transform(this.MlcInfoFormGroup.get('reportingDate')?.value, 'yyyy-MM-dd');
    const timeValue = this.MlcInfoFormGroup.get('reportingTime')?.value;
    const time = new Date(timeValue);

    // extract hours and minutes
    const hours = time.getHours();
    const minutes = time.getMinutes();

    // combine reportingDate + reportingTime
    const combinedDateTime = new Date(
      selectedDate + 'T' + this.pad(hours) + ':' + this.pad(minutes) + ':00'
    );

    this.MlcInfoFormGroup.get('reportingDate').setValue(this.datePipe.transform(this.MlcInfoFormGroup.get('reportingDate').value, 'yyyy-MM-dd'))
    this.MlcInfoFormGroup.get('reportingTime').setValue(combinedDateTime)

    this.MlcInfoFormGroup.get('admissionId').setValue(this.EmgId ?? this.AdmissionId)
    if (!this.MlcInfoFormGroup.invalid) {
      console.log(this.MlcInfoFormGroup.value)
      this._AdmissionService.MlcInsert(this.MlcInfoFormGroup.value).subscribe((response) => {
        console.log(response)
        this.getMLCdetailview(response)
        this._matDialog.closeAll();
      });
    } else {
      const invalidFields = [];

      if (this.MlcInfoFormGroup.invalid) {
        for (const controlName in this.MlcInfoFormGroup.controls) {
          if (this.MlcInfoFormGroup.controls[controlName].invalid) {
            invalidFields.push(`MlcInfo Form: ${controlName}`);
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

  pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      mlcno: [
        { name: "required", Message: "mlcno is required" }
      ],
      authorityName: [
        { name: "required", Message: "authorityName is required" }
      ],
      buckleNo: [
        { name: "required", Message: "buckleNo is required" }
      ],
      policeStation: [
        { name: "required", Message: "policeStation is required" }
      ]
    };
  }
  getMLCdetailview(AdmissionId) {
    debugger
    this.commonService.Onprint("AdmissionID", AdmissionId, "IpMLCCasePaperPrint");
  }


  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      const splitDate = dateOfReg.toLocaleString("en-US").split(',');
      const splitTime = this.MlcInfoFormGroup.get('reportingDate').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      const selectedDate = new Date(this.MlcInfoFormGroup.get('reportingTime').value);
      const splitDate = selectedDate.toLocaleString("en-US").split(',');
      const splitTime = this.MlcInfoFormGroup.get('reportingTime').value.toLocaleString("en-US").split(',');
      this.isTimeChanged = true;
      this.phdatetime = splitTime[1]
      console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    const localaDateValues = actualDate.split('/');
    const localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
  onClear() { }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    this.dialogRef.close();
  }

}

export class MlcDetail {
  mlcid: any;
  admissionId: any;
  mlcno: any;
  reportingDate: any;
  reportingTime: any;
  authorityName: any;
  buckleNo: any;
  policeStation: any;
  seqNo: any;
  emgId: any;
  refDocName: any;
  refDoctorName: any;
  roomName: any;
  bedName: any;
  patientType: any;
  tariffName: any;
  companyName: any;
  admissionTime: any;
  emgTime: any;
  ipdno: any;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  GenderName: any;
  regNo: any;
  patientName: any;
  doctorname: any;
  doctorName: any;
  departmentName: any;
  detailGiven: any;
  remark: any;
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(MlcDetail) {
    {
      this.mlcid = MlcDetail.mlcid || 0;
      this.admissionId = MlcDetail.admissionId || 0;
      this.mlcno = MlcDetail.mlcno || '';
      this.reportingDate = MlcDetail.reportingDate || '';
      this.reportingTime = MlcDetail.reportingTime || '';
      this.authorityName = MlcDetail.authorityName || '';
      this.buckleNo = MlcDetail.buckleNo || '';
      this.policeStation = MlcDetail.policeStation || '';
      this.seqNo = MlcDetail.seqNo || ''
      this.refDocName = MlcDetail.refDocName || 0;
      this.refDoctorName = MlcDetail.refDoctorName || 0;
      this.roomName = MlcDetail.roomName || '';
      this.bedName = MlcDetail.bedName || '';
      this.patientType = MlcDetail.patientType || '';
      this.tariffName = MlcDetail.tariffName || '';
      this.companyName = MlcDetail.companyName || '';
      this.admissionTime = MlcDetail.admissionTime || '';
      this.emgTime = MlcDetail.emgTime || ''
      this.ipdno = MlcDetail.ipdno || '';
      this.ageYear = MlcDetail.ageYear || ''
      this.ageMonth = MlcDetail.ageMonth || '';
      this.ageDay = MlcDetail.ageDay || ''
      this.GenderName = MlcDetail.GenderName || '';
      this.regNo = MlcDetail.regNo || ''
      this.patientName = MlcDetail.patientName || '';
      this.doctorname = MlcDetail.doctorname || ''
      this.doctorName = MlcDetail.doctorName || '';
      this.departmentName = MlcDetail.departmentName || ''
      this.detailGiven = MlcDetail.detailGiven || ''
      this.remark = MlcDetail.remark || ''
    }
  }
}