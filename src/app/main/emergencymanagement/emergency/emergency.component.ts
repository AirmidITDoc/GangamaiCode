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
   f_name: any = ""
    l_name: any = ""
   fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.actionsTemplate;
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
    { heading: "-", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 10 },
    { heading: "DateTime", key: "emgTime", sort: true, align: 'left', emptySign: 'NA',type:9,width: 200},
    { heading: "FistName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AddedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allfilters = [
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
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
    if (event == 'F_Name')
        this._EmergencyService.myFilterform.get('F_Name').setValue("")
    if (event == 'L_Name')
        this._EmergencyService.myFilterform.get('L_Name').setValue("")
    this.onChangeFirst();
  }

  onChangeFirst() {
     this.fromDate = this.datePipe.transform(this._EmergencyService.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this._EmergencyService.myFilterform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this._EmergencyService.myFilterform.get('F_Name').value + "%"
    this.l_name = this._EmergencyService.myFilterform.get('L_Name').value + "%"
    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "Emergency/Emergencylist",
      columnsList: this.allcolumns,
      sortField: "EmgId",
      sortOrder: 0,
      filters: [
         { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
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
        maxHeight: '80%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  EmergencyCancel(data){
    Swal.fire({
      title:'Do You want to cancel Emergency?',
      text:"You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag)=>{
      if(flag.isConfirmed){
         let submitData = { "emgId": data.emgId }
        console.log(submitData);
        this._EmergencyService.EmgCancel(submitData).subscribe((res)=>{
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
  dateofBirth: any;
  prefixId: any;
  regId: any;
  departmentId:any;
  docNameId:any;
  doctorId:any;
  genderID:any;
  emgId:any;

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
      this.dateofBirth = EmergencyList.dateofBirth || ''
      this.prefixId = EmergencyList.prefixId || 0
      this.regId = EmergencyList.regId || 0
      this.departmentId = EmergencyList.departmentId || 0
      this.docNameId = EmergencyList.docNameId || 0
      this.doctorId = EmergencyList.doctorId || 0
      this.genderID = EmergencyList.genderID || 0
      this.emgId = EmergencyList.emgId || 0
    }
  }
}