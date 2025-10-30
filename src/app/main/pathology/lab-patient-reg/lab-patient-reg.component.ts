import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { NewAppointmentComponent } from 'app/main/opd/appointment-list/new-appointment/new-appointment.component';
import { NewAdmissionComponent } from 'app/main/ipd/Admission/admission/new-admission/new-admission.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MLCInformationComponent } from 'app/main/ipd/Admission/admission/mlcinformation/mlcinformation.component';
import { LabPatientRegService } from './lab-patient-reg.service';
import { NewLabPatientRegComponent } from './new-lab-patient-reg/new-lab-patient-reg.component';

@Component({
  selector: 'app-lab-patient-reg',
  templateUrl: './lab-patient-reg.component.html',
  styleUrls: ['./lab-patient-reg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class LabPatientRegComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  myFilterform: FormGroup;
  f_name: any = ""
  l_name: any = ""
  Status: any = "0";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  constructor(
    public _labPatientRegService: LabPatientRegService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._labPatientRegService.CreateSearchGroup();
    // this.GetAppointdetail();
  }

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Date-Time", key: "reqDateTime", sort: true, align: 'left', emptySign: 'NA'},
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "ageYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "City", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 190, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: "", opType: OperatorComparer.StartsWith },
    // { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    // { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
  ]

  gridConfig: gridModel = {
    apiUrl: "LabPatientRegistration/LabPatientRegistrationList",
    columnsList: this.allcolumns,
    sortField: "LabPatientId",
    sortOrder: 0,
    filters: this.allfilters
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'firstName')
      this.myFilterform.get('firstName').setValue("")
    if (event == 'L_Name')
      this.myFilterform.get('L_Name').setValue("")
    this.onChangeFirst();
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
    // this.f_name = this.myFilterform.get('firstName').value + "%"
    // this.l_name = this.myFilterform.get('L_Name').value + "%"
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "LabPatientRegistration/LabPatientRegistrationList",
      columnsList: this.allcolumns,
      sortField: "LabPatientId",
      
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        // { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        // { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    // this.GetAppointdetail();
  }

  new(row: any = null) {
    const dialogRef = this._matDialog.open(NewLabPatientRegComponent,
      {
        maxWidth: "95vw",
        maxHeight: '90vh',
        // height: '90%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
      // this.GetAppointdetail();
    });
  }
}

export class LabPatientList {

  PatientName: string;
  Date: Number;
  RegNo: number;
  MobileNo: number;
  Doctorname: number;
  patientTypeID: any;
  firstName: any;
  middleName: any;
  lastName: any;
  genderId: any;
  address: any;
  pinNo: any;
  stateId: any;
  cityId: any;
  countryId: any;
  mobileNo: any;
  phoneNo: any;
  dateofBirth: Date;
  dateOfBirth: Date;
  currentDate = new Date();
  prefixId: any;
  regId: any;
  departmentId: any;
  docNameId: any;
  doctorId: any;
  genderID: any;
  emgId: any;
  comment: any;
  tariffId: any;
  classId: any;
  tariffid: any;
  classid: any;
  tariffName: any;
  genderName: any;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  patientName: any;
  doctorName: any;
  departmentName: any;
  chiefComplaint: any;
  diagnosis: any;
  examination: any;
  height: any;
  pweight: any;
  bmi: any;
  bsl: any;
  spo2: any;
  pulse: any;
  bp: any;
  temp: any;
  advice: any;
  emgHistoryId: any;
  attendingDoctorId: any;
  refDoctorId: any;
  spO2: any;
  isMlc: any;
  convertedIntoAdm: any;
  age: any;
  refDocId: any;

  constructor(LabPatientList) {
    {
      this.Date = LabPatientList.Date || 0;
      this.RegNo = LabPatientList.RegNo || 0;
      this.MobileNo = LabPatientList.MobileNo || 0;
      this.Doctorname = LabPatientList.Doctorname || '';
      this.PatientName = LabPatientList.PatientName || '';
      this.patientTypeID = LabPatientList.patientTypeID || 0
      this.firstName = LabPatientList.firstName || ''
      this.middleName = LabPatientList.middleName || ''
      this.lastName = LabPatientList.lastName || ''
      this.genderId = LabPatientList.genderId || 0
      this.address = LabPatientList.address || ''
      this.pinNo = LabPatientList.pinNo || 0
      this.stateId = LabPatientList.stateId || 0
      this.cityId = LabPatientList.cityId || 0
      this.countryId = LabPatientList.countryId || 0
      this.mobileNo = LabPatientList.mobileNo || 0
      this.phoneNo = LabPatientList.phoneNo || 0
      this.dateOfBirth = LabPatientList.dateOfBirth || this.currentDate;
      this.dateofBirth = LabPatientList.dateofBirth || this.currentDate;
      this.prefixId = LabPatientList.prefixId || 0
      this.regId = LabPatientList.regId || 0
      this.departmentId = LabPatientList.departmentId || 0
      this.docNameId = LabPatientList.docNameId || 0
      this.doctorId = LabPatientList.doctorId || 0
      this.refDocId = LabPatientList.refDocId || 0
      this.genderID = LabPatientList.genderID || 0
      this.emgId = LabPatientList.emgId || 0
      this.comment = LabPatientList.comment || ''
      this.tariffId = LabPatientList.tariffId || 0
      this.classId = LabPatientList.classId || 0
      this.tariffid = LabPatientList.tariffid || 0
      this.classid = LabPatientList.classid || 0
      this.genderName = LabPatientList.genderName || ''
      this.tariffName = LabPatientList.tariffName || ''
      this.ageYear = LabPatientList.ageYear || 0
      this.ageMonth = LabPatientList.ageMonth || 0
      this.ageDay = LabPatientList.ageDay || 0
      this.patientName = LabPatientList.patientName || ''
      this.doctorName = LabPatientList.doctorName || ''
      this.departmentName = LabPatientList.departmentName || ''
      this.chiefComplaint = LabPatientList.chiefComplaint || ''
      this.diagnosis = LabPatientList.diagnosis || ''
      this.examination = LabPatientList.examination || ''
      this.height = LabPatientList.height || ''
      this.pweight = LabPatientList.pweight || ''
      this.bmi = LabPatientList.bmi || ''
      this.bsl = LabPatientList.bsl || ''
      this.spo2 = LabPatientList.spo2 || ''
      this.pulse = LabPatientList.pulse || ''
      this.bp = LabPatientList.bp || ''
      this.temp = LabPatientList.temp || ''
      this.advice = LabPatientList.advice || ''
      this.emgHistoryId = LabPatientList.emgHistoryId || 0
      this.attendingDoctorId = LabPatientList.attendingDoctorId || 0
      this.refDoctorId = LabPatientList.refDoctorId || 0
      this.spO2 = LabPatientList.spO2 || 0
      this.isMlc = LabPatientList.isMlc || false
      this.convertedIntoAdm = LabPatientList.convertedIntoAdm || ''
      this.age = LabPatientList.age || 0
    }
  }
}

export class LabRequest {
  ServiceName: any;
  Price: number;
  ServiceId: any;
  CreditedtoDoctor: any;
  constructor(LabRequest) {
    this.ServiceName = LabRequest.ServiceName || '';
    this.Price = LabRequest.Price || 0;
    this.ServiceId = LabRequest.ServiceId || 0;
    this.CreditedtoDoctor = LabRequest.CreditedtoDoctor || 0;
  }
}
