import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ComponentRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { ToastrService } from 'ngx-toastr';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PatientList, SampleDetailObj, SampleList } from 'app/main/pathology/result-entry/result-entry.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { LabRadApprovallistService } from './lab-rad-approvallist.service';
import { NewRadResultTemplateComponent } from '../lab-radiology/new-rad-result-template/new-rad-result-template.component';


@Component({
  selector: 'app-lab-rad-approvallist',
  templateUrl: './lab-rad-approvallist.component.html',
  styleUrls: ['./lab-rad-approvallist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabRadApprovallistComponent {

  SpinLoading: boolean = false;
  Vtotalcount = 0
  VCompletedcount = 0
  Vpendingcount = 0

  reportPrintObjList: SampleDetailObj[] = [];
  reportPrintObjs: SampleDetailObj;
  currentDate = new Date();
  click: boolean = false;
  printTemplate: any;
  MouseEvent = true;
  screenFromString = 'opd-casepaper';
  PatientTypeList: any = [];
  myformSearch: FormGroup;
  isLoading = true;
  msg: any;
  step = 0;
  dataArray = {};
  sIsLoading: string = '';
  isSampleCollection: boolean = true;
  ServiceIdList: any = [];
  PathReportID: any;
  RadReportId: any
  subscriptionArr: Subscription[] = [];
  reportPrintObj: AdmissionPersonlModel;
  SBillNo: any;
  SOPIPtype: any;
  SFromDate: any;
  PatientName: any;
  OPD_IPD: any;
  Age: any;
  PatientType: any;
  dateTimeObj: any;
  chargeslist = [];
  resultSource = [];
  printdata = [];
  Mobileno: any;
  setStep(index: number) {
    this.step = index;
  }
  SearchName: string;
  OP_IPType: any;
  Iscompleted: any;
  reportIdData: any = [];
  ServiceIdData: any = [];

  fromDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
  toDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
  searchregNo: any;
  vOPIPId = 0;
  f_name: any = "%"
  regNo: any = "0"
  l_name: any = "%"
  age = ''
  gendername = ''
  Category = '%'
  vStatusSearch: any = "1";
  patientName: 'RK'
  title: 'Reports'
  autocompleteModeunit: string = "Hospital";
  autocompleteModeCategoryId: string = "PathCategory";
  page: PageNames = PageNames.PATIENT;
  pathFiles: PageNames = PageNames.PATIENT_PATHFILES;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<PatientList>();
  dataSource1 = new MatTableDataSource<SampleList>();
  // resultSource = new MatTableDataSource<SampleList>();

  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  displayedColumns1: string[] = [
    'select',
    // 'IsCompleted',
    // 'IsTemplateTest',
    // 'outSourceStatus',
    // 'isVerifyid',
    'action1',
    'status',
    'verify',
    'CategoryName',
    'TestName',
    'SampleCollectionTime',
    'SampleNo',
    'outSourceLabName',
    'action'
  ];

  hasSelectedContacts: boolean;
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  IsEdit: boolean = this.permissionService.getPermission(permissionCodes.ExternalInvestigation, permissionType.Edit);

  fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, 'MM/dd/yyyy') : "";
  todate = this.toDate ? this.datePipe.transform(this.toDate, 'MM/dd/yyyy') : "";

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.isCompletedstatus;
  }
  @ViewChild('isCompletedstatus') isCompletedstatus!: TemplateRef<any>;

  allcolumns = [

    { heading: "Status", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template },
    { heading: "Test Date", key: "radTime", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "CategoryName", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "SampleCollectionTime", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];
  gridConfig: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "Radiology/LabRadiologyApproveList",
    columnsList: this.allcolumns,
    sortField: "RadReportId",
    sortOrder: 0,
    filters: [
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
      { fieldName: "ApprovalStatus", fieldValue: "1", opType: OperatorComparer.Equals },
    ]
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    public _LabResultListService: LabRadApprovallistService,
    public datePipe: DatePipe,
    private reportDownloadService: ExcelDownloadService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private _fuseSidebarService: FuseSidebarService,
    public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay,
    private _loggedService: AuthenticationService,
    public permissionService: PagePermissionService,
  ) { }


  ngOnInit(): void {
    this.myformSearch = this._LabResultListService.createSearchForm()
    this.fromDate = this.myformSearch.get("start").value || "";
    this.toDate = this.myformSearch.get("end").value || "";
    this.GetResultdetail();
  }

  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeFirst();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  status: any = "0"
  // opipType: any = "3";
  onChangeFirst() {
    this.dataSource1.data = [];

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, 'MM/dd/yyyy')
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, 'MM/dd/yyyy')
    this.status = this.myformSearch.get('StatusSearch').value || 0

    this.GetResultdetail();
    this.getfilterdata();
  }

  getfilterdata() {

    this.gridConfig = {
      apiUrl: "Radiology/LabRadiologyApproveList",
      columnsList: this.allcolumns,
      sortField: "RadReportId",
      sortOrder: 0,
      filters: [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
        { fieldName: "ApprovalStatus", fieldValue: this.status, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  OPIPID: any = 0;

  onClear() {
    this._LabResultListService.myformSearch.get('RegNoSearch').setValue("0");
    this._LabResultListService.myformSearch.get('StatusSearch').setValue("1");
    this._LabResultListService.myformSearch.get('PatientTypeSearch').setValue("3");
  }

  GetResultdetail() {

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, 'MM/dd/yyyy')
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, 'MM/dd/yyyy')
    this.Vtotalcount = 0;
    this.VCompletedcount = 0;
    this.Vpendingcount = 0;

    let data =
    {
      "first": 0,
      "rows": 150,
      "sortField": "RadReportId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "From_Dt",
          "fieldValue": this.fromDate,
          "opType": "Equals"
        },
        {
          "fieldName": "To_Dt",
          "fieldValue": this.toDate,
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": "4",
          "opType": "Equals"
        },
        {
          "fieldName": "ApprovalStatus",
          "fieldValue": String(this.status),
          "opType": "Equals"
        },
      ],
      "exportType": "JSON",
      "columns": []
    }

    console.log(data)
    this._LabResultListService.getarrovallist(data).subscribe((response) => {
      this.dataSource.data = response.data;
      console.log(this.dataSource.data)
      if (this.dataSource.data.length > 0) {
        this.Vtotalcount = this.dataSource.data.length
        this.dataSource.data.forEach(element => {
          // debugger
          if (element.isCompleted == true) {
            this.VCompletedcount = this.VCompletedcount + 1;
          } else if (element.isCompleted == false) {
            this.Vpendingcount = this.Vpendingcount + 1;
          }

        });
        console.log(this.dataSource.data)
      }
    });
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewRadResultTemplateComponent,
      {
        maxHeight: '99vh',
        width: '80%',
        data: {
          data: row,
          verifyCheck: true
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  getPrint(contact) {

    console.log(contact)

      Swal.fire({
        title: 'Select Report Format',
        text: "Choose how you want to view the report:",
        icon: "warning",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        denyButtonColor: "#6c757d",
        cancelButtonColor: "#d33",
        confirmButtonText: "With Header",
        denyButtonText: "Without Header",
      }).then((result) => {

        if (result.isConfirmed) {
          this.viewgetRadioloyTemplateReportPdf(contact);
        } else if (result.isDenied) {
          this.viewgetRadioloyTemplateReportPdf1(contact);
        }
      });
  }

  viewgetRadioloyTemplateReportPdf(contact) {
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "RadReportId",
            "fieldValue": String(contact.radReportId),
            "opType": "13"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": "4",
            "opType": "13"
          }
        ],
        "mode": "RadiologyTemplateReportWithHeader"
      }

      this._LabResultListService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Radiology Template Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  viewgetRadioloyTemplateReportPdf1(contact) {
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "RadReportId",
            "fieldValue": String(contact.radReportId),
            "opType": "13"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": "4",
            "opType": "13"
          }
        ],
        "mode": "RadiologyTemplateReportWithoutHeader"
      }

      this._LabResultListService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Radiology Template Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }
}
