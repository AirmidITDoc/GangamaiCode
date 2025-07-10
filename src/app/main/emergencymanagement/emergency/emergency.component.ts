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
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
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
    { heading: "DateTime", key: "date", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
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
    { fieldName: "BankName", fieldValue: "", opType: OperatorComparer.Contains },
    { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    apiUrl: "",
    columnsList: this.allcolumns,
    sortField: "",
    sortOrder: 0,
    filters: this.allfilters
  }

  Clearfilter(event) {
    console.log(event)
    // if (event == 'BankNameSearch')
    //     this._bankService.myformSearch.get('BankNameSearch').setValue("")

    this.onChangeFirst();
  }

  onChangeFirst() {
    // this.bankName = this._bankService.myformSearch.get('BankNameSearch').value
    // this.getfilterdata();
  }

  getfilterdata() {
    debugger
    // let isActive = this._bankService.myformSearch.get("IsDeletedSearch").value || "";
    this.gridConfig = {
      apiUrl: "",
      columnsList: this.allcolumns,
      sortField: "",
      sortOrder: 0,
      filters: [
        // { fieldName: "bankName", fieldValue: this.bankName, opType: OperatorComparer.Contains },
        // { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
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

    });
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
  dateOfBirth: any;
  prefixId: any;
  regId: any;
  departmentId:any;
  docNameId:any;

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
      this.dateOfBirth = EmergencyList.dateofBirth || ''
      this.prefixId = EmergencyList.prefixId || 0
      this.regId = EmergencyList.regId || 0
      this.departmentId = EmergencyList.departmentId || 0
      this.docNameId = EmergencyList.docNameId || 0
    }
  }
}