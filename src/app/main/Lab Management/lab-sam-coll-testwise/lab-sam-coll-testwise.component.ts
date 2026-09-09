import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LabSamCollTestwiseService } from './lab-sam-coll-testwise.service';

@Component({
  selector: 'app-lab-sam-coll-testwise',
  templateUrl: './lab-sam-coll-testwise.component.html',
  styleUrls: ['./lab-sam-coll-testwise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabSamCollTestwiseComponent {
  myformSearch: FormGroup;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  vCompanyId: any = "0"
  VPBillNo = "%"
  vTestId: any = "0"
  vOutSourceId: any = "0"

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('genderANDage') genderANDage!: TemplateRef<any>;
  autocompleteModecompany: string = "Company";
  autocompleteModeoutsource: string = "OutsourceLab";

  constructor(public _SampleCollectionService: LabSamCollTestwiseService,
    public _matDialog: MatDialog, private commonService: PrintserviceService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public permissionService: PagePermissionService,
    private _loggedService: AuthenticationService,) { }

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'genderName')!.template = this.genderANDage;
  }

  allcolumns = [
    // {
    //   heading: "-", key: "action1", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
    //   template: this.statusbtnTemplate
    // },
    { heading: "Date-Time", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 8 },
    { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Gender-Age", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.template },
    { heading: "Test Name", key: "serviceNames", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "OutSource Name", key: "outSourceLabName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Hospital Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
  ];

  gridConfig: gridModel = {
    apiUrl: "LabPatientRegistration/LabSamcollectionTestwiseList",
    columnsList: this.allcolumns,
    sortField: "LabPatientId",
    sortOrder: 0,
    filters: [
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
      { fieldName: "PBillNo", fieldValue: this.VPBillNo, opType: OperatorComparer.StartsWith },
      { fieldName: "CompanyId", fieldValue: this.vCompanyId, opType: OperatorComparer.Equals },
      { fieldName: "TestId", fieldValue: this.vTestId, opType: OperatorComparer.Equals },
      { fieldName: "OutSourceId", fieldValue: this.vOutSourceId, opType: OperatorComparer.Equals }
    ]
  }

  ngOnInit(): void {
    this.myformSearch = this._SampleCollectionService.createSearchForm()
  }

  onChangeFirst() {
    // debugger
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.VPBillNo = this.myformSearch.get('PBillNo').value || "%"
    this.vCompanyId = this.myformSearch.get('CompanyId').value || "0"
    this.vTestId = this.myformSearch.get('TestId').value || "0"
    this.vOutSourceId = this.myformSearch.get('OutSourceId').value || "0"
    this.getfilterdata();
  }

  getfilterdata() {
    // debugger
    this.gridConfig = {
      apiUrl: "LabPatientRegistration/LabSamcollectionTestwiseList",
      columnsList: this.allcolumns,
      sortField: "LabPatientId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "PBillNo", fieldValue: this.VPBillNo, opType: OperatorComparer.StartsWith },
        { fieldName: "CompanyId", fieldValue: this.vCompanyId, opType: OperatorComparer.Equals },
        { fieldName: "TestId", fieldValue: String(this.vTestId), opType: OperatorComparer.Equals },
        { fieldName: "OutSourceId", fieldValue: this.vOutSourceId, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'PBillNo')
      this.myformSearch.get('PBillNo').setValue("")

    this.onChangeFirst();
  }

  ListViewcompany(value) {
    console.log(value)
    if (value.value !== 0)
      this.vCompanyId = value.value
    else
      this.vCompanyId = 0

    this.onChangeFirst();
  }

  ListViewTest(value) {
    console.log(value)
    if (value.value !== 0)
      this.vTestId = value.serviceId
    else
      this.vTestId = 0

    this.onChangeFirst();
  }

  ListViewOutSource(value) {
    console.log(value)
    if (value.value !== 0)
      this.vOutSourceId = value.value
    else
      this.vOutSourceId = 0

    this.onChangeFirst();
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
