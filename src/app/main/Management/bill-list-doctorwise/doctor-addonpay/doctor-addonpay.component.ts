import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { BillDoctorwiseService } from '../bill-doctorwise.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { RegInsert } from 'app/main/opd/registration/registration.component';

@Component({
  selector: 'app-doctor-addonpay',
  templateUrl: './doctor-addonpay.component.html',
  styleUrls: ['./doctor-addonpay.component.scss']
})
export class DoctorAddonpayComponent {

  AdddocpayFormGroup: FormGroup;
  myForm: FormGroup;
  dateTimeObj: any;
  screenFromString = 'Common-form';
  autocompleteModeCompany: string = "Company";
  autocompleteModedoctor: string = "ConDoctor";

  AdmissionId: any;
  ServiceId = 0
  ServiceName = ''
  doctorId = 0
  doctorName = ''

  public value = new Date();
  date: string;
  dateValue: any = new Date().toISOString();

  isTimeChanged: boolean = false;
  minDate: Date;
  timeflag = 0;
  public now: Date = new Date();
  dateTimeString: any;
  phdatetime: any;
  registerObj = new RegInsert({})
  vRegNo: any = 0;
  vPatientName: any;
  vAdmissionDate: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vAge: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  vDOA: any;
 vAdmissionID: any;
 vClassId: any;

  constructor(public _DoctorShareService: BillDoctorwiseService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DoctorAddonpayComponent>,
    private router: Router
  ) {
    this.date = new Date().toISOString().slice(0, 16);
  }
  ApiURL: any
  ngOnInit(): void {
    console.log(this.data);
    this.AdddocpayFormGroup = this.createadddocpayForm();
    this.AdddocpayFormGroup.markAllAsTouched();
    this.myForm = this._DoctorShareService.createMyForm();


    this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="


    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString().split(',');
      if (!this.isTimeChanged) {
        this.AdddocpayFormGroup.get('billTime').setValue(this.now);
        if (this.AdddocpayFormGroup.get('billTime'))
          this.AdddocpayFormGroup.get('billTime').setValue(this.now);
      }
    }, 1);
  }

  createadddocpayForm() {
    return this.formBuilder.group({
      pbillNo: [0, [Validators.required]],
      patientName: ['', [Validators.required]],
      docId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // admissionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      companyId: 0,
      serviceName: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      billDate: [(new Date()).toISOString()],
      billTime: ['', [Validators.required]],
      price: [0, [Validators.required]],
      qty: [0, [Validators.maxLength(5), Validators.required]],
      totalAmount: [0, [Validators.required]],
      isProcess: 1,
      docAmount: 0,
      tranDate: [(new Date()).toISOString()],
      tranTime: [(new Date()).toISOString()],

    });
  }

  onSubmit() {


    let selectedDate = this.datePipe.transform(this.AdddocpayFormGroup.get('billDate')?.value, 'yyyy-MM-dd');
    let timeValue = this.AdddocpayFormGroup.get('billTime')?.value;
    let time = new Date(timeValue);

    // extract hours and minutes
    let hours = time.getHours();
    let minutes = time.getMinutes();

    // combine reportingDate + reportingTime
    let combinedDateTime = new Date(
      selectedDate + 'T' + this.pad(hours) + ':' + this.pad(minutes) + ':00'
    );

    this.AdddocpayFormGroup.get('billDate').setValue(this.datePipe.transform(this.AdddocpayFormGroup.get('billDate').value, 'yyyy-MM-dd'))
    this.AdddocpayFormGroup.get('billTime').setValue(combinedDateTime)
    debugger
    this.AdddocpayFormGroup.get('serviceName').setValue(this.ServiceName)
    this.AdddocpayFormGroup.get('docId').setValue(this.doctorId)
    console.log(this.AdddocpayFormGroup.value)

    debugger
    // if (!this.AdddocpayFormGroup.invalid) {

    this._DoctorShareService.additionpayInsert(this.AdddocpayFormGroup.value).subscribe((response) => {
      this._matDialog.closeAll();
    });
    // } else {
    //   let invalidFields = [];

    //   if (this.AdddocpayFormGroup.invalid) {
    //     for (const controlName in this.AdddocpayFormGroup.controls) {
    //       if (this.AdddocpayFormGroup.controls[controlName].invalid) {
    //         invalidFields.push(`Addition Pay Form: ${controlName}`);
    //       }
    //     }
    //   }
    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => {
    //       this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
    //       );
    //     });
    //   }
    // }
  }



  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.registerObj = obj
      this.vRegNo = obj.regNo
      this.vDoctorName = obj.doctorName
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vDepartment = obj.departmentName
      this.vAdmissionDate = obj.admissionDate
      this.vAdmissionTime = obj.admissionTime
      this.vIPDNo = obj.ipdNo
      this.vAge = obj.age
      this.vAgeMonth = obj.ageMonth
      this.vAgeDay = obj.ageDay
      this.vGenderName = obj.genderName
      this.vRefDocName = obj.refDoctorName
      this.vRoomName = obj.roomName
      this.vBedName = obj.bedName
      this.vPatientType = obj.patientType
      this.vTariffName = obj.tariffName
      this.vCompanyName = obj.companyName
      this.vDOA = obj.admissionDate
      this.vAdmissionID = obj.admissionID
      this.vClassId = obj.classId
    }
  }

  selectChangeService(event) {

    this.ServiceId = event.serviceId
    this.ServiceName = event.serviceName

  }

  selectChangedoctor(event) {
    console.log(event)
    this.doctorId = event.value
    this.doctorName = event.text

  }

  pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      billno: [
        { name: "required", Message: "Billno is required" }
      ],
      PatientName: [
        { name: "required", Message: "PatientName is required" }
      ],
      companyId: [
        // { name: "required", Message: "company is required" }
      ],
      serviceId: [
        { name: "required", Message: "service is required" }
      ],
      qty: [
        { name: "required", Message: "Qty is required" }
      ],
      total: [
        { name: "required", Message: "Total is required" }
      ],
      docamt: [
        { name: "required", Message: "Docamt is required" }
      ],
      price: [
        { name: "required", Message: "Price is required" }
      ],
      docId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
    };
  }

  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString().split(',');
      let splitTime = this.AdddocpayFormGroup.get('reportingDate').value.toLocaleString().split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.AdddocpayFormGroup.get('reportingTime').value);
      let splitDate = selectedDate.toLocaleString().split(',');
      let splitTime = this.AdddocpayFormGroup.get('reportingTime').value.toLocaleString().split(',');
      this.isTimeChanged = true;
      this.phdatetime = splitTime[1]
      console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  totalAmount = 0
  calculateTotalamt() {

    const form = this.AdddocpayFormGroup;
    const qty = +form.get('qty').value || 0;
    const rate = +form.get('price').value || 0;

    this.totalAmount = qty * rate;
    let netAmount = 0;

  }

  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
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

