import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { SamplecollectionPageComponent } from '../sample-collection/samplecollection-page/samplecollection-page.component';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { Console } from 'console';
import { ResultEntryService } from '../result-entry/result-entry.service';
import { PatientList, SampleDetailObj, SampleList } from '../result-entry/result-entry.component';


@Component({
  selector: 'app-report-dispatch',
  templateUrl: './report-dispatch.component.html',
  styleUrls: ['./report-dispatch.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ReportDispatchComponent {
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
  PathTestId: any
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

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  searchregNo: any;
  vOPIPId = 0;
  f_name: any = "%"
  regNo: any = "0"
  l_name: any = "%"

  age = ''
  gendername = ''

  vStatusSearch: any = "1";
  patientName: 'RK'
  title: 'Reports'
  page: PageNames = PageNames.PATIENT;
  pathFiles: PageNames = PageNames.PATIENT_PATHFILES;
  status: any = "1"
  opipType: any = "2";

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<PatientList>();
  dataSource1 = new MatTableDataSource<SampleList>();
  selection = new SelectionModel<SampleList>(true, []);

  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  displayedColumns1: string[] = [
    'action1',
    'status',
    'verify',
    'CategoryName',
    'TestName',
    // 'SampleCollectionTime',
    // 'SampleNo',
    // 'outSourceLabName',
    // 'outSourceSampleSentDateTime',
    // 'outSourceReportCollectedDateTime',
    'action'
  ];

  hasSelectedContacts: boolean;

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionsIPOP') actionsIPOP!: TemplateRef<any>;

  fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
  todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";
  ngAfterViewInit() {
    // this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsIPOP;
  }

  allcolumns = [
    {
      heading: "-", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template,
      template: this.actionsIPOP, width: 30
    },
    { heading: "DOA", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Test Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Age | Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Admission No", key: "oP_IP_No", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

    // {
    //   heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate  // Assign ng-template to the column
    // }
  ];

  gridConfig: gridModel = {
    apiUrl: "Pathology/PathologyPatientTestList",
    columnsList: this.allcolumns,
    sortField: "PresReId",
    sortOrder: 0,
    filters: [

      { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt ", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt ", fieldValue: this.todate, opType: OperatorComparer.Equals },
      { fieldName: "IsCompleted", fieldValue: "1", opType: OperatorComparer.Equals },
      { fieldName: "OP_IP_Type", fieldValue: "2", opType: OperatorComparer.Equals }
    ]
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    public _SampleService: ResultEntryService,
    public datePipe: DatePipe,
    private reportDownloadService: ExcelDownloadService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._SampleService.createSearchForm()
    this.fromDate = this.myformSearch.get("start").value || "";
    this.toDate = this.myformSearch.get("end").value || "";
    this.GetResultdetail();
  }


  searchRecords(data) {
    this.dataSource1.data = [];
    this.selection.clear();

    let regno = this.myformSearch.get("RegNoSearch").value || "0";
    let fromDate = this.myformSearch.get("start").value || "";
    let toDate = this.myformSearch.get("end").value || "";
    fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
    toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
    let patientType = this.myformSearch.get("PatientTypeSearch").value || "2";
    let status = this.myformSearch.get("StatusSearch").value || "1";

    this.GetResultdetail()
    // Update the filters dynamically
    this.gridConfig = {
      apiUrl: "Pathology/PathologyPatientTestList",

      columnsList: this.allcolumns,
      sortField: "PresReId",
      sortOrder: 0,
      filters: [

        { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "Reg_No", fieldValue: regno, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt ", fieldValue: fromDate, opType: OperatorComparer.Equals }, //"2024-01-01"
        { fieldName: "To_Dt ", fieldValue: toDate, opType: OperatorComparer.Equals }, //"2024-10-01"
        { fieldName: "IsCompleted", fieldValue: status, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: patientType, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  getSelectedRow(row: any): void {

    console.log("Selected row : ", row);

    this.dataSource1.data = [];
    this.selection.clear();

    this.reportPrintObj = row
    this.reportPrintObj["DOA"] = row.pathDate

    this.PatientName = row.patientName;
    this.OPD_IPD = row.oP_IP_No
    this.Age = row.ageYear
    this.PatientType = row.patientType
    this.Mobileno = row.mobileNo
    this.SBillNo = row.billNo;
    this.SOPIPtype = row.opdipdtype;
    this.SFromDate = this.datePipe.transform(row.pathDate, "yyyy-MM-dd ");

    this.getSampledetailList1(row);
  }

  getSampledetailList1(row) {
    // debugger
    this.dataSource1.data = [];
    let rawDate = row.pathDate;
    let day = rawDate.split("T")[0];
    let rest = rawDate.split("T")[1].split("-");
    let month = rest[0];
    let year = rest[1];

    let formattedDate = `${day}`

    console.log(formattedDate);

    let OPIP = row.patientType === 'OP' ? "0" : "1";
    // debugger

    console.log(this.opipType)
    if (this.opipType == '4')
      OPIP = "4"

    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "RegNo",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(row.billNo),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": OPIP,
          "opType": "Equals"
        },
        {
          "fieldName": "From_Dt",
          "fieldValue": formattedDate,
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    console.log(m_data);
    this._SampleService.PathResultentryDetailList(m_data).subscribe(Visit => {
      this.dataSource1.data = Visit.data as SampleList[];
      console.log("ResultList:", this.dataSource1.data)
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator;

    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  GetResultdetail() {

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.Vtotalcount = 0;
    this.VCompletedcount = 0;
    this.Vpendingcount = 0;

    let data =
    {
      "first": 0,
      "rows": 150,
      "sortField": "PresReId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "F_Name",
          "fieldValue": String(this.f_name),
          "opType": "Contains"
        },
        {
          "fieldName": "L_Name",
          "fieldValue": String(this.l_name),
          "opType": "Contains"
        },
        {
          "fieldName": "Reg_No",
          "fieldValue": String(this.regNo),
          "opType": "Equals"
        },

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
          "fieldName": "IsCompleted",
          "fieldValue": String(this.status),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": String(this.myformSearch.get("PatientTypeSearch").value || "2"),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }


    console.log(data)
    this._SampleService.getresultenterylist(data).subscribe((response) => {
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

  onChangeFirst() {
    this.dataSource1.data = [];

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
    this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
    this.status = this.myformSearch.get('StatusSearch').value || '1'
    this.opipType = this.myformSearch.get('PatientTypeSearch').value
    this.regNo = this.myformSearch.get('RegNoSearch').value || ""

    this.GetResultdetail();
    this.getfilterdata();
  }

  getfilterdata() {

    this.gridConfig = {
      apiUrl: "Pathology/PathologyPatientTestList",
      columnsList: this.allcolumns,
      sortField: "PresReId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: this.opipType, opType: OperatorComparer.Equals }

      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }


  Clearfilter(event) {
    console.log(event)
    if (event == 'RegNoSearch')
      this.myformSearch.get('RegNoSearch').setValue("")

    if (event == 'FirstNameSearch')
      this.myformSearch.get('FirstNameSearch').setValue("")

    if (event == 'LastNameSearch')
      this.myformSearch.get('LastNameSearch').setValue("")

    this.onChangeFirst();
  }

  onClear() {
    this._SampleService.myformSearch.get('RegNoSearch').setValue("0");
    this._SampleService.myformSearch.get('StatusSearch').setValue("1");
    this._SampleService.myformSearch.get('PatientTypeSearch').setValue("2");
  }

  getVerifyTooltip(contact: any): string {
    if (contact.isVerifyid) {
      return `Verified On : ${contact.isVerifyedDate}\nVerified By : ${contact.verifiedUserName}`;
    }

    return contact.isCompleted
      ? 'Verify Report'
      : 'Test is Pending';
  }
}
