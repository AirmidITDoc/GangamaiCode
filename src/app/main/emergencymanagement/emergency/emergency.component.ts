import { fuseAnimations } from '@fuse/animations';
import { NewEmergencyComponent } from './new-emergency/new-emergency.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { EmergencyService } from './emergency.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmergencyHistoryComponent } from './emergency-history/emergency-history.component';
import { EmergencyBillComponent } from './emergency-bill/emergency-bill.component';
import { NewAppointmentComponent } from 'app/main/opd/appointment-list/new-appointment/new-appointment.component';
import { NewAdmissionComponent } from 'app/main/ipd/Admission/admission/new-admission/new-admission.component';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class EmergencyComponent implements OnInit {

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  myFilterform: FormGroup;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('oldNewTemplate') oldNewTemplate!: TemplateRef<any>;
  @ViewChild('after24Hr') after24Hr!: TemplateRef<any>;
  f_name: any = ""
  l_name: any = ""
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'regId')!.template = this.oldNewTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isAfter24Hrs')!.template = this.after24Hr;
  }

  constructor(
    public _EmergencyService: EmergencyService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._EmergencyService.CreateSearchGroup();
  }

  allcolumns = [
    { heading: "-", key: "regId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,width:10 },
    { heading: "-", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,width:10 },
    { heading: "-", key: "isAfter24Hrs", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,width:10 },
    { heading: "HourCompleted", key: "hoursSinceAdmission", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DateTime", key: "emgTime", sort: true, align: 'left', emptySign: 'NA', type: 9, width: 200 },
    { heading: "FistName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "City", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith }
  ]

  gridConfig: gridModel = {
    apiUrl: "Emergency/Emergencylist",
    columnsList: this.allcolumns,
    sortField: "EmgId",
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
    this.f_name = this.myFilterform.get('firstName').value + "%"
    console.log(this.myFilterform.get('firstName').value)
    this.l_name = this.myFilterform.get('L_Name').value + "%"
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "Emergency/Emergencylist",
      columnsList: this.allcolumns,
      sortField: "EmgId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate || "1900-01-01", opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.toDate || "2100-12-31", opType: OperatorComparer.StartsWith },
        { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    console.log("GridConfig:", this.gridConfig);
  }
  newEmergency(row: any = null) {
    const dialogRef = this._matDialog.open(NewEmergencyComponent,
      {
        maxWidth: "95vw",
        maxHeight: '90vh',
        height: '90%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
    });
  }

  EmergencyHistory(row: any = null) {
    const dialogRef = this._matDialog.open(EmergencyHistoryComponent,
      {
        maxWidth: "95vw",
        maxHeight: '80%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  OnBillPayment(row: any = null) {
    const dialogRef = this._matDialog.open(EmergencyBillComponent,
      {
        maxWidth: "100%",
        width: '95%',
        height: '95%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  getConvert(row) {
    const patientName = `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim() || 'the patient';

    Swal.fire({
      title: `Convert ${patientName} to OPD or IPD?`,
      text: 'Please choose the type you want to convert this patient to:',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      denyButtonColor: '#6c757d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Convert to OPD',
      denyButtonText: 'Convert to IPD',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show second dialog with 2 options
        Swal.fire({
          title: 'Appointment Check',
          text: 'Does the patient already have an appointment today?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonColor: '#198754',
          denyButtonColor: '#0dcaf0',
          cancelButtonColor: '#dc3545',
          confirmButtonText: 'Yes',
          denyButtonText: "No",
          cancelButtonText: 'Cancel'
        }).then((res) => {
          if (res.isConfirmed) {
            // need to show list of patient
            const dialogRef = this._matDialog.open(NewAppointmentComponent, {
              maxWidth: '95vw',
              height: '95%',
              width: '90%',
              data: row
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log('old appointment', result);
              this.grid.bindGridData();
            });

          } else if (res.isDenied) {
            const dialogRef = this._matDialog.open(NewAppointmentComponent, {
              maxWidth: '95vw',
              height: '95%',
              width: '90%',
              data: row
            });
            dialogRef.afterClosed().subscribe(result => {
              console.log('new appointment', result);
              this.grid.bindGridData();
            });
          }
        });
      }
      else if (result.isDenied) {
        const dialogRef = this._matDialog.open(NewAdmissionComponent, {
          maxWidth: '95vw',
          width: '100%',
          height: '98vh',
          data: row
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('IPD conversion dialog closed', result);
          this.grid.bindGridData();
        });
      }
    });
  }


  EmergencyCancel(data) {
    Swal.fire({
      title: 'Do You want to cancel Emergency?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        let submitData = { "emgId": data.emgId }
        console.log(submitData);
        this._EmergencyService.EmgCancel(submitData).subscribe((res) => {
          this.grid.bindGridData();
        })
      }
    })
  }
}

export class EmergencyList {

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
  tariffName:any;
  genderName:any;
  ageYear:any;
  ageMonth:any;
  ageDay:any;
  patientName:any;
doctorName:any;
departmentName:any;
  constructor(EmergencyList) {
    {
      this.Date = EmergencyList.Date || 0;
      this.RegNo = EmergencyList.RegNo || 0;
      this.MobileNo = EmergencyList.MobileNo || 0;
      this.Doctorname = EmergencyList.Doctorname || '';
      this.PatientName = EmergencyList.PatientName || '';
      this.patientTypeID = EmergencyList.patientTypeID || 0
      this.firstName = EmergencyList.firstName || ''
      this.middleName = EmergencyList.middleName || ''
      this.lastName = EmergencyList.lastName || ''
      this.genderId = EmergencyList.genderId || 0
      this.address = EmergencyList.address || ''
      this.pinNo = EmergencyList.pinNo || 0
      this.stateId = EmergencyList.stateId || 0
      this.cityId = EmergencyList.cityId || 0
      this.countryId = EmergencyList.countryId || 0
      this.mobileNo = EmergencyList.mobileNo || 0
      this.phoneNo = EmergencyList.phoneNo || 0
      this.dateOfBirth = EmergencyList.dateOfBirth || this.currentDate;
      this.dateofBirth = EmergencyList.dateofBirth || this.currentDate;
      this.prefixId = EmergencyList.prefixId || 0
      this.regId = EmergencyList.regId || 0
      this.departmentId = EmergencyList.departmentId || 0
      this.docNameId = EmergencyList.docNameId || 0
      this.doctorId = EmergencyList.doctorId || 0
      this.genderID = EmergencyList.genderID || 0
      this.emgId = EmergencyList.emgId || 0
      this.comment = EmergencyList.comment || ''
      this.tariffId = EmergencyList.tariffId || 0
      this.classId = EmergencyList.classId || 0
      this.tariffid = EmergencyList.tariffid || 0
      this.classid = EmergencyList.classid || 0
      this.genderName = EmergencyList.genderName || ''
      this.tariffName = EmergencyList.tariffName || ''
      this.ageYear = EmergencyList.ageYear || 0
      this.ageMonth = EmergencyList.ageMonth || 0
      this.ageDay = EmergencyList.ageDay || 0
      this.patientName = EmergencyList.patientName || ''
      this.doctorName = EmergencyList.doctorName || ''
      this.departmentName = EmergencyList.departmentName || ''
    }
  }
}

export class ChargesList {
  ChargesId: any
  chargesId: number;
  ServiceId: number;
  ServiceName: String;
  Price: number;
  Qty: number;
  TotalAmt: number;
  DiscPer: number;
  DiscAmt: number;
  NetAmount: number;
  DoctorId: number;
  ChargeDoctorName: String;
  ChargesDate: Date;
  IsPathology: boolean;
  IsRadiology: boolean;
  ClassId: number;
  ClassName: string;
  ChargesAddedName: string;
  BalanceQty: any;
  IsStatus: any;
  extMobileNo: any;
  doctorName: any;
  ConcessionPercentage: any;
  EditDoctor: any;
  constructor(ChargesList) {
    this.chargesId = ChargesList.chargesId || '';
    this.ServiceId = ChargesList.ServiceId || '';
    this.doctorName = ChargesList.doctorName || '';
    this.ServiceName = ChargesList.ServiceName || '';
    this.Price = ChargesList.Price || '';
    this.Qty = ChargesList.Qty || '';
    this.TotalAmt = ChargesList.TotalAmt || '';
    this.DiscPer = ChargesList.DiscPer || '';
    this.DiscAmt = ChargesList.DiscAmt || '';
    this.NetAmount = ChargesList.NetAmount || '';
    this.DoctorId = ChargesList.DoctorId || 0;
    this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
    this.ChargesDate = ChargesList.ChargesDate || '';
    this.IsPathology = ChargesList.IsPathology || '';
    this.IsRadiology = ChargesList.IsRadiology || '';
    this.ClassId = ChargesList.ClassId || 0;
    this.ClassName = ChargesList.ClassName || '';
    this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    this.BalanceQty = ChargesList.BalanceQty || 0;
    this.IsStatus = ChargesList.IsStatus || 0;
    this.extMobileNo = ChargesList.extMobileNo || ''
    this.ConcessionPercentage = ChargesList.ConcessionPercentage || ''
  }
}