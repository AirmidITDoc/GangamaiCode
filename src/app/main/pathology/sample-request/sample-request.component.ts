import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PathologyService } from '../pathology.service';
import { isThisSecond } from 'date-fns';
import { set } from 'lodash';
import { permissionCodes } from 'app/main/shared/model/permission.model';

@Component({
  selector: 'app-sample-request',
  templateUrl: './sample-request.component.html',
  styleUrls: ['./sample-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SampleRequestComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;

  myformSearch: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  RequestId: any = 0;
  Ispathradio = 0;
  vOPIPId = 0;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  Istype = 1
  IsCompleted = 0
  Vtotalcount = 0
  VCompletedcount = 0
  Vpendingcount = 0


  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;
  isShowDetailTable: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<NursingPathRadRequestList>();

  hasSelectedContacts: boolean;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild('isTestCompletedIcon') isTestCompletedIcon!: TemplateRef<any>;
  @ViewChild('isTestCompletedmasterIcon') isTestCompletedmasterIcon!: TemplateRef<any>;
  @ViewChild('isPathologyicon') isPathologyicon!: TemplateRef<any>;
  @ViewChild('isRadiologyicon') isRadiologyicon!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('isOnFileTestIcon') isOnFileTestIcon!: TemplateRef<any>;
  gridConfig1: gridModel = new gridModel();

  allcolumns = [
    { heading: "FileOn", key: "isOnFileTest", width: 70, sort: true, align: 'left', type: gridColumnTypes.template },
    { heading: "Completed", key: "isTestCompted", sort: true, align: 'left', type: gridColumnTypes.template, width: 30 },

    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
    { heading: "DOA", key: "admDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Request Date", key: "reqDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },
    { heading: "Ward Name | Bed Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 350 },

  ];
  gridConfig: gridModel = {
    permissionCode: permissionCodes.SamplecollectionList,
    apiUrl: "PathlogySampleCollection/LabOrRadRequestPatientList",
    columnsList: this.allcolumns,
    sortField: "RegNo",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "Istype", fieldValue: String(this.Istype), opType: OperatorComparer.Equals },
      { fieldName: "IsCompleted", fieldValue: String(this.IsCompleted), opType: OperatorComparer.Equals }
    ]
  }
  @ViewChild('statuspath') statuspath!: TemplateRef<any>;
  @ViewChild('statusradio') statusradio!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private _httpClient: HttpClient,
    public _PathologyService: PathologyService,
    private _ActRoute: Router,
    private reportDownloadService: ExcelDownloadService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._PathologyService.createSampleRequstForm()
    this.Getrequestdetail()
  }


  GetDetails1(data) {
    debugger
    let requestId = data.requestId;
    let isPathOrRad = this.myformSearch.get('IsPathOrRad').value;

    this.gridConfig1 = {
      apiUrl: "PathlogySampleCollection/LabOrRadRequestDetailList",
      columnsList: [
        { heading: "IsClosed", key: "isClosed", type: gridColumnTypes.status, align: "center", width: 50 },
        { heading: "IsStatus", key: "isStatus", type: gridColumnTypes.status, align: 'center' },

        { heading: "TestType", key: "isPathology", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30, template: this.statuspath },
        { heading: "", key: "isRadiology", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30, template: this.statusradio },
        { heading: "Completed", key: "isTestCompted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30, template: this.statusTemplate },

        // { heading: "ReqDate", key: "reqDate", sort: true, align: 'left', emptySign: 'NA' , width: 200},
        { heading: "ReqTime", key: "reqTime", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Billing User", key: "billingUser", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        // { heading: "Added By", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' , width: 200},
        { heading: "AddedBy", key: "addedByDate", sort: true, align: 'left', emptySign: 'NA', width: 300 },

      ],
      sortField: "RequestId",
      sortOrder: 0,
      filters: [
        { fieldName: "RequestId", fieldValue: String(requestId), opType: OperatorComparer.Equals },
        { fieldName: "IsPathOrRad", fieldValue: String(isPathOrRad), opType: OperatorComparer.Equals }
      ]
    };
    this.isShowDetailTable = true;
    setTimeout(() => {
      this.grid1.gridConfig = this.gridConfig1;
      this.grid1.bindGridData();
    }, 500);
  }


  ngAfterViewInit() {

    this.gridConfig.columnsList.find(col => col.key === 'isTestCompted')!.template = this.isTestCompletedmasterIcon;
    this.gridConfig.columnsList.find(col => col.key === 'isOnFileTest')!.template = this.isOnFileTestIcon;
  }

  onChangeFirst() {
    debugger
    this.isShowDetailTable = false;

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.regNo = this.myformSearch.get('RegNo').value || ""
    this.Istype = this.myformSearch.get('IsPathOrRad').value
    this.IsCompleted = this.myformSearch.get('IsCompleted').value

    this.getfilterdata();
  }

  getfilterdata() {

    this.gridConfig = {
      apiUrl: "PathlogySampleCollection/LabOrRadRequestPatientList",
      columnsList: this.allcolumns,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "Istype", fieldValue: this.Istype, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: this.IsCompleted, opType: OperatorComparer.Equals },

      ]

    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    this.Getrequestdetail()
  }

  Getrequestdetail() {

    this.Vtotalcount = 0;
    this.VCompletedcount = 0;
    this.Vpendingcount = 0;
    let fromDateControl = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd");
    let toDateControl = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd");

    let filters: any[] = [];

    // Handle date range
    if (fromDateControl && toDateControl) {
      this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
      this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
    } else {
      this.fromDate = "1900-01-01";
      this.toDate = "1900-01-01";
    }

    filters.push(

      {
        "fieldName": "FromDate",
        "fieldValue": this.fromDate,
        "opType": "GreaterThanOrEqual"
      },
      {
        "fieldName": "ToDate",
        "fieldValue": this.toDate,
        "opType": "GreaterThanOrEqual"
      },
      {
        "fieldName": "Reg_No",
        "fieldValue": String(this.regNo),
        "opType": "Equals"
      },
      {
        "fieldName": "Istype",
        "fieldValue": String(this.Istype),
        "opType": "Equals"
      },
      {
        "fieldName": "IsCompleted",
        "fieldValue": String(this.IsCompleted),
        "opType": "Equals"
      }
    );

    let data = {
      "first": 0,
      "rows": 999999,
      "sortField": "RegNo",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };

    console.log(data)

    this._PathologyService.getsamplerequestlist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      console.log(this.dataSource.data)
      if (this.dataSource.data.length > 0) {
        this.Vtotalcount = this.dataSource.data.length
        this.dataSource.data.forEach(element => {
          if (element.isTestCompted == true) {
            this.VCompletedcount = this.VCompletedcount + 1;
          } else if (element.isTestCompted == false) {
            this.Vpendingcount = this.Vpendingcount + 1;
          }
        });


        console.log(this.dataSource.data)
      }
    });

  }



  Clearfilter(event) {
    if (event == "RegNo")
      this.myformSearch.get("RegNo").setValue("")

    this.onChangeFirst();
  }


  toggle(val: any) {

    if (val == "1") {
      this.Ispathradio = 1;
    } else if (val == "2") {
      this.Ispathradio = 2;
    }
    else {
      this.Ispathradio = 0;

    }
  }



  private route: ActivatedRoute
  private router: Router

}

export class LabOrRadRequestList {

  RegNo: any;
  PatientName: String;
  AdmDate: Date;
  WardName: string;
  IsOnFileTest: boolean;
  OP_IP_ID: any;
  AgeYear: any;
  IsTestCompted: any;
  BedName: any;
  ReqDate: any;

  constructor(LabOrRadRequestList) {
    this.RegNo = LabOrRadRequestList.RegNo;
    this.PatientName = LabOrRadRequestList.PatientName;
    this.AdmDate = LabOrRadRequestList.AdmDate || '0';
    this.WardName = LabOrRadRequestList.WardName;
    this.IsOnFileTest = LabOrRadRequestList.IsOnFileTest || '0';
    this.OP_IP_ID = LabOrRadRequestList.OP_IP_ID || '0';
    this.AgeYear = LabOrRadRequestList.AgeYear || '0';
    this.IsTestCompted = LabOrRadRequestList.IsTestCompted || '0';
    this.BedName = LabOrRadRequestList.BedName || '';
    this.ReqDate = LabOrRadRequestList.ReqDate || '';


  }

}

export class NursingPathRadRequestList {
  ReqDate: Date;
  ReqTime: Date;
  ServiceName: string;
  AddedByName: string;
  BillingUser: string;
  AddedByDate: Date;
  IsStatus: number;
  PBillNo: number;
  ServiceId: any;
  IsPathology: any;
  IsRadiology: any;
  isTestCompted: any;
  isSampleCollection: any;
  isCompleted: any

  constructor(NursingPathRadRequestList) {
    this.ReqDate = NursingPathRadRequestList.ReqDate || '';
    this.ReqTime = NursingPathRadRequestList.ReqTime || '';
    this.ServiceName = NursingPathRadRequestList.ServiceName || 0;
    this.AddedByName = NursingPathRadRequestList.AddedByName || '';
    this.BillingUser = NursingPathRadRequestList.BillingUser || '';
    this.AddedByDate = NursingPathRadRequestList.AddedByDate || '';
    this.IsStatus = NursingPathRadRequestList.IsStatus || 0;
    this.PBillNo = NursingPathRadRequestList.PBillNo || 0;
    this.ServiceId = NursingPathRadRequestList.ServiceId || 0;
    this.IsPathology = NursingPathRadRequestList.IsPathology || 0;
    this.IsRadiology = NursingPathRadRequestList.IsRadiology || 0;
    this.isTestCompted = NursingPathRadRequestList.isTestCompted || 0;
    this.isSampleCollection = NursingPathRadRequestList.isSampleCollection || 0;
    this.isCompleted = NursingPathRadRequestList.isCompleted || 0;


  }

}

