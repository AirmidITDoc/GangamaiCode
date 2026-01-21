import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { LabResultListService } from './lab-result-list.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PatientList, SampleDetailObj, SampleList } from 'app/main/pathology/result-entry/result-entry.component';
import { SamplecollectionPageComponent } from 'app/main/pathology/sample-collection/samplecollection-page/samplecollection-page.component';
import { NewResultEntryComponent } from 'app/main/pathology/result-entry/new-result-entry/new-result-entry.component';
import { NewResultTemplateComponent } from 'app/main/pathology/result-entry/new-result-template/new-result-template.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';

function formatDate(rawDate: string): string {
  if (!rawDate) return '';

  // Case 1: ISO format with T → 2026-01-15T00:00:00
  if (rawDate.includes('T')) {
    return rawDate.split('T')[0]; // 2026-01-15
  }

  // Case 2: Space format → 15-01-2026 00:00:00
  if (rawDate.includes(' ')) {
    const datePart = rawDate.split(' ')[0]; // 15-01-2026
    const [day, month, year] = datePart.split('-');
    return `${year}-${month}-${day}`; // 2026-01-15
  }

  return '';
}

@Component({
  selector: 'app-lab-result-list',
  templateUrl: './lab-result-list.component.html',
  styleUrls: ['./lab-result-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabResultListComponent {
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

  vStatusSearch: any = "0";
  patientName: 'RK'
  title: 'Reports'
  autocompleteModeunit: string = "Hospital";
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

  fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
  todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Test Date", key: "doa", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    // { heading: "DOA", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Age | Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  gridConfig: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "LabPatientRegistration/LabResultList",
    columnsList: this.allcolumns,
    sortField: "PresReId",
    sortOrder: 0,
    filters: [

      { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt ", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt ", fieldValue: this.todate, opType: OperatorComparer.Equals },
      { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
    ]
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    public _SampleService: LabResultListService,
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
    this.myformSearch = this._SampleService.createSearchForm()
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

    // this.onChangeFirst();
  }

  searchRecords(data) {
    this.dataSource1.data = [];
    this.selection.clear();

    let regno = this.myformSearch.get("RegNoSearch").value || "0";
    let fromDate = this.myformSearch.get("start").value || "";
    let toDate = this.myformSearch.get("end").value || "";
    fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
    toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
    let status = this.myformSearch.get("StatusSearch").value || "0";

    this.GetResultdetail()
    // Update the filters dynamically
    this.gridConfig = {
      apiUrl: "LabPatientRegistration/LabResultList",

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
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
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

    this.getSampledetailList1(row);
  }

  getSampledetailList1(row) {
    this.dataSource1.data = [];
    let rawDate = row.pathDate;

    let formattedDate = formatDate(row.pathDate);
    // let formattedDate = `${day}`

    console.log(formattedDate);

    var m_data = {
      "first": 0,
      "rows": 20,
      "sortField": "PathDate",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(row.billNo),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": "4",
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

  status: any = "0"
  // opipType: any = "3";
  onChangeFirst() {
    this.dataSource1.data = [];

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
    this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
    this.status = this.myformSearch.get('StatusSearch').value
    this.regNo = this.myformSearch.get('RegNoSearch').value || "0"

    this.GetResultdetail();
    this.getfilterdata();
  }

  getfilterdata() {

    this.gridConfig = {
      apiUrl: "LabPatientRegistration/LabResultList",
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
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }


  Clearfilter(event) {
    console.log(event)
    if (event == 'RegNoSearch')
      this.myformSearch.get('RegNoSearch').setValue("0")

    if (event == 'FirstNameSearch')
      this.myformSearch.get('FirstNameSearch').setValue("")

    if (event == 'LastNameSearch')
      this.myformSearch.get('LastNameSearch').setValue("")

    this.onChangeFirst();
  }

  onSampleCollSave(row: any = null) {
    const dialogRef = this._matDialog.open(SamplecollectionPageComponent,
      {
        // maxWidth: "75vw",
        maxHeight: '75vh',
        width: '70%',
        data: { row: row, type: 'Lab' }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
      this.getSelectedRow(event);
    });
  }

  IsTemplateTest: any;
  chkresultentry(contact, flag) {
    // debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];

    if (flag)
      this.IsTemplateTest = contact[0]["isTemplateTest"]
    else
      this.IsTemplateTest = contact.isTemplateTest

    console.log(contact)
    if (this.IsTemplateTest == 0) {
      if (this.selection.selected.length == 0) {

        this.toastr.warning('CheckBox Select !', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      else {
        setTimeout(() => {
          let data = [];

          this.selection.selected.forEach(element => {
            console.log(element)
            data.push({
              PathReportId: element["pathReportID"].toString(),
              ServiceId: element["serviceId"].toString(),
              IsCompleted: element["isCompleted"].toString()
            });
            this.printdata.push({ PathReportId: element["pathReportID"].toString() });
          });

          console.log(this.printdata)
          data.forEach((element) => {
            console.log('aaaaaa:', element)
            this.reportIdData.push(element.PathReportId)
            this.ServiceIdData.push(element.ServiceId)
            if (element.IsCompleted == "true")
              this.Iscompleted = 1;
          });

          const dialogRef = this._matDialog.open(NewResultEntryComponent,
            {
              maxWidth: "96vw",
              height: "96vh",
              width: "96%",
              data: {
                RIdData: data,
                patientdata: this.reportPrintObj,
                type: 'Lab',
                sampleNo: contact[0].sampleNo
              }
            });
          dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.getSelectedRow(event);
          });
        }, 100);
        return;
      }
    }
    else if (contact.isTemplateTest == 1) {
      this.advanceDataStored.storage = new SampleDetailObj(contact);
      const dialogRef = this._matDialog.open(NewResultTemplateComponent,
        {
          maxWidth: "75vw",
          height: '95%',
          width: '96%',
          data: contact,
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Pathology Template  Saved ..', result);
      });
      return;
    }
    this.searchRecords(contact)
    // this.selection.clear(); // Clears all selected items
    // this.dataSource1.data = [];
  }

  chkresultentryEdit(contact, flag) {
    // debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];

    if (flag)
      this.IsTemplateTest = contact.isTemplateTest

    console.log(contact)
    if (this.IsTemplateTest == 0) {
      setTimeout(() => {
        let data = [];
        const contactArray = Array.isArray(contact) ? contact : [contact];
        contactArray.forEach(element => {
          console.log(element)
          data.push({
            PathReportId: element["pathReportID"].toString(),
            ServiceId: element["serviceId"].toString(),
            IsCompleted: element["isCompleted"].toString()
          });
          this.printdata.push({ PathReportId: element["pathReportID"].toString() });
        });

        console.log(this.printdata)
        data.forEach((element) => {
          console.log('aaaaaa:', element)
          this.reportIdData.push(element.PathReportId)
          this.ServiceIdData.push(element.ServiceId)
          if (element.IsCompleted == "true")
            this.Iscompleted = 1;
        });

        const dialogRef = this._matDialog.open(NewResultEntryComponent,
          {
            maxWidth: "96vw",
            height: "96vh",
            width: "96%",
            data: {
              RIdData: data,
              patientdata: this.reportPrintObj,
              type: 'Lab',
              sampleNo: contact.sampleNo
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.grid.bindGridData();
          this.getSelectedRow(event);
        });
      }, 100);
      return;
    }
    this.searchRecords(contact)
    // this.selection.clear(); // Clears all selected items
    // this.dataSource1.data = [];
  }

  chkresultentryVerify(contact, flag) {
    // debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];

    if (flag)
      this.IsTemplateTest = contact.isTemplateTest

    console.log(contact)
    if (this.IsTemplateTest == 0) {
      setTimeout(() => {
        let data = [];
        const contactArray = Array.isArray(contact) ? contact : [contact];
        contactArray.forEach(element => {
          console.log(element)
          data.push({
            PathReportId: element["pathReportID"].toString(),
            ServiceId: element["serviceId"].toString(),
            IsCompleted: element["isCompleted"].toString()
          });
          this.printdata.push({ PathReportId: element["pathReportID"].toString() });
        });

        console.log(this.printdata)
        data.forEach((element) => {
          console.log('aaaaaa:', element)
          this.reportIdData.push(element.PathReportId)
          this.ServiceIdData.push(element.ServiceId)
          if (element.IsCompleted == "true")
            this.Iscompleted = 1;
        });

        const dialogRef = this._matDialog.open(NewResultEntryComponent,
          {
            maxWidth: "96vw",
            height: "96vh",
            width: "96%",
            data: {
              RIdData: data,
              patientdata: this.reportPrintObj,
              verifyCheck: true,
              type: 'Lab'
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.grid.bindGridData();
          this.getSelectedRow(event);
        });
      }, 100);
      return;
    }
    this.searchRecords(contact)
    // this.selection.clear(); // Clears all selected items
    // this.dataSource1.data = [];
  }

  chkTemplateVerify(contact, flag) {
    debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];

    if (flag)
      this.IsTemplateTest = contact.isTemplateTest

    console.log(contact)
    if (this.IsTemplateTest == 1) {
      setTimeout(() => {
        let data = [];
        const contactArray = Array.isArray(contact) ? contact : [contact];
        contactArray.forEach(element => {
          console.log(element)
          data.push({
            PathReportId: element["pathReportID"].toString(),
            ServiceId: element["serviceId"].toString(),
            IsCompleted: element["isCompleted"].toString()
          });
          this.printdata.push({ PathReportId: element["pathReportID"].toString() });
        });

        console.log(this.printdata)
        data.forEach((element) => {
          console.log('aaaaaa:', element)
          this.reportIdData.push(element.PathReportId)
          this.ServiceIdData.push(element.ServiceId)
          if (element.IsCompleted == "true")
            this.Iscompleted = 1;
        });

        const dialogRef = this._matDialog.open(NewResultTemplateComponent,
          {
            maxWidth: "75vw",
            height: '95%',
            width: '96%',
            data: {
              data: contact,
              verifyCheck: true
            }
          });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Pathology Template  Saved ..', result);
        });
        return;
      }, 100);
      return;
    }
    this.searchRecords(contact)
  }

  OPIPID: any = 0;
  onresultentryshow(event, m) {
    // debugger
    console.log("2nd Table Data:", m)
    this.OPIPID = m.opdipdid //m.OPD_IPD_ID
    this.advanceDataStored.storage = new SampleDetailObj(m);
    if (event.checked) {
      if (m.pathTestID == 0) {
        this.toastr.warning('This Test Not Created !', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }

    }

    if (!m || typeof m !== 'object' || !('isTemplateTest' in m) || m.isTemplateTest == null) {

      this.toastr.warning('This Test Not Created!', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      console.log('isTemplateTest not found or null, dataSource1 cleared.');
      return;
    }
  }

  Cancleresult(row) {
    Swal.fire({
      title: 'Confirm Result cancellation ',
      text: 'Are you sure you want to Cancel the result?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate!'

    }).then((flag) => {
      // debugger
      if (flag.isConfirmed) {

        let submitData = {
          "pathReportID": row.pathReportId
        };
        console.log(submitData);
        this._SampleService.RoolbackStatus(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Data Updated Successfully !', 'success').then((result) => {
              this._matDialog.closeAll();
              this.grid.bindGridData();
              this.dataSource1.data = [];
            });
          } else {
            Swal.fire('Error !', 'Pathology Resulentry data not Updated', 'error');
          }

        });
      }
    });
    // this.onEdit(row);
  }

  viewgetPathologyTemplateReportPdf1(contact: any, mode: string) {

    setTimeout(() => {
      const param = {
        searchFields: [
          {
            fieldName: "PathReportId",
            fieldValue: String(contact.pathReportID),
            opType: "Equals"
          },
          {
            fieldName: "OP_IP_Type",
            fieldValue: String(contact.opdIpdType),
            opType: "Equals"
          }
        ],
        mode: mode  // dynamic
      };
      console.log(param)
      this._SampleService.getReportView(param).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent, {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Template Report Viewer"
          }
        });
        matDialog.afterClosed().subscribe(result => { });
      });
    }, 100);
  }

  getPrint(contact) {

    console.log(contact)

    if (contact.isTemplateTest)

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
          this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplateWithHeader");
        } else if (result.isDenied) {
          this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplateWithOutHeader");
        }
      });
    else {
      // this.viewgetPathologyTestReportPdf(contact)
      if (this.selection.selected.length == 0) {
        this.toastr.warning('CheckBox Select !', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.Printresultentry();
      }
    }
    this.selection.clear();
  }

  OP_IP_Type: any;

  selectedItem: any;
  // opiptype = this.selectedItem.opdipdtype;
  CompletdFlag = 1

  // changed by raksha 5/11/25
  Printresultentry(row: any = null) {
    // debugger
    console.log(row);
    console.log(this.selection.selected);
    let pathologyDelete = [];

    this.selectedItem = this.selection.selected[0];

    this.selection.selected.forEach((element) => {
      pathologyDelete.push({ pathReportId: element.pathReportID });
    });
    if (this.selectedItem.isCompleted)
      this.CompletdFlag = 1
    else
      this.CompletdFlag = 0

    pathologyDelete.push({ pathReportId: this.selectedItem.pathReportID });

    const submitData = {
      pathPrintResultEntry: pathologyDelete
    };

    console.log(submitData);
    if (this.CompletdFlag) {
      this._SampleService.PathPrintResultentryInsert(submitData).subscribe(res => {
        if (res) {
          this.viewgetPathologyTestReportPdf(this.selectedItem)
        }
      });
    } else {
      Swal.fire("Selcted test Not Completd for Print.....")
    }
  }

  viewgetPathologyTestReportPdf(data) {
    const param = {
      searchFields: [
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(data.opdIpdType),
          opType: "Equals"
        }
      ],
      mode: "PathologyReportWithOutHeader"
    };

    console.log(param);

    this._SampleService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Pathology Test Report Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
    });

  }

  Printresultentrywithheader() {

    console.log(this.selection.selected);
    let pathologyDelete = [];

    this.selectedItem = this.selection.selected[0];

    this.selection.selected.forEach((element) => {
      pathologyDelete.push({ pathReportId: element.pathReportID });
    });

    const submitData = {
      pathPrintResultEntry: pathologyDelete
    };

    console.log(submitData);

    this._SampleService.PathPrintResultentryInsert(submitData).subscribe(res => {
      if (res) {
        this.viewgetPathologyTestReportwithheaderPdf(this.selectedItem)
      }
    });
  }

  viewgetPathologyTestReportwithheaderPdf(data) {

    console.log(this.selection.selected);
    const param = {
      searchFields: [
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(data.opdIpdType),
          opType: "Equals"
        }
      ],
      mode: "PathologyReportWithHeader"
    };


    console.log(param);

    this._SampleService.getReportView(param).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Pathology Test Report With Header Viewer"
        }
      });

      matDialog.afterClosed().subscribe(result => {

      });
    });
    // });
  }

  AdList: boolean = false;

  whatsappresultentry() {
    console.log(this.selection.selected)
    let pathologyDelete = [];
    this.selection.selected.forEach((element) => {
      this.SOPIPtype = element["OPD_IPD_Type"]
      let pathologyDeleteObj = {};
      pathologyDeleteObj['pathReportId'] = element["PathReportID"]
      pathologyDelete.push(pathologyDeleteObj);
    });
    let submitData = {
      "printInsert": pathologyDelete,
    };
    console.log(submitData);
    this._SampleService.PathPrintResultentryInsert(submitData).subscribe(response => {
    });
    // this.selection.clear();
  }

  onsamplecolltion(contact) {
    console.log(contact)
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const dialogRef1 = this._matDialog.open(NewResultTemplateComponent,
      {
        maxWidth: "75vw",
        height: '95%',
        width: '96%',
        data: {

          regobj: contact
        }
      });

    dialogRef1.afterClosed().subscribe(result => {
    });
  }
  Editoutsoucedata(row) {
    console.log(row)

    this.advanceDataStored.storage = new AdvanceDetailObj(row);

    const dialogRef1 = this._matDialog.open(OutsourceDetailsComponent,
      {
        maxWidth: "80vw",
        // height: '60vh',
        // width: '100%',
        width: "45%",
        height: "60%",
        data: row
      });

    dialogRef1.afterClosed().subscribe(result => {
      this.grid.bindGridData();
      this.getSelectedRow(event);
    });
  }

  onVerify(row) {
    Swal.fire({
      title: 'Confirm Verify Report ',
      text: 'Are you sure you want to Verify Report?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#41ea76ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Verify!'

    }).then((flag) => {
      // debugger
      if (flag.isConfirmed) {

        let submitData = {

          "pathReportId": row.pathReportId,
          "isVerifyid": this.accountService.currentUserValue.userId,
          "isVerifySign": true,
          "isVerifyedDate": new Date().toISOString()

        };
        console.log(submitData);
        this._SampleService.PathReportverifyMaster(submitData).subscribe(response => {
          this.getSampledetailList1(event);
        });
      }
    });
    // this.onEdit(row);
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
          "fieldName": "UnitId",
          "fieldValue": String(this.UnitId),
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
  OnPrintPatientIcard(element) {
    console.log('Third action clicked for:', element);
    this.commonService.Onprint("AdmissionId", element.visit_Adm_ID, "IPStickerPrint");
  }
  selection = new SelectionModel<SampleList>(true, []);


  masterToggle() {
    // debugger
    const totalTests = this.dataSource1.data.length;
    const collectedTests = this.dataSource1.data.filter(
      (row: any) => row.isSampleCollection === 'True'
    );
    const notCollectedCount = totalTests - collectedTests.length;
    if (notCollectedCount > 0) {
      Swal.fire(
        'Sample Pending',
        `Still ${notCollectedCount} test(s) remaining to collect sample`,
        'warning'
      );
      return;
    }

    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource1.data.forEach(row => this.selection.select(row));
    }

    console.log('Selected items count:', this.selection.selected.length);
    this.resultSource = [...this.selection.selected];
    console.log('Selected items:', this.resultSource);
  }

  isSomeSelected() {
    // console.log(this.selection.selected);
    return this.selection.selected.length > 0;
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onSearchClear() {
    this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;

    return numSelected === numRows;
  }

  onClear() {
    this._SampleService.myformSearch.get('RegNoSearch').setValue("0");
    this._SampleService.myformSearch.get('StatusSearch').setValue("0");
    this._SampleService.myformSearch.get('PatientTypeSearch').setValue("3");
  }

  // getWhatsappshareBill(el) {
  //     console.log(el);
  //     this._whatsppService.OnWhatsAppMsgSent({
  //         mobileNo: el.mobileNo,
  //         patientName: el.patientName,
  //         billNo: el.billNo,
  //         smsType: "OPBill",
  //         patientId: el.regNo
  //     })
  // }

  // Onemail(contact) {
  //     const dialogRef = this._matDialog.open(EmailSendComponent,
  //         {
  //             maxWidth: "100%",
  //             height: '75%',
  //             width: '55%',
  //             data: {
  //                 Obj: contact,
  //                 emailType: 'OP-Bill'
  //             }
  //         });
  //     dialogRef.afterClosed().subscribe(result => {
  //         this.grid.bindGridData();
  //     });
  // }

  getVerifyTooltip(contact: any): string {
    if (contact.isVerifyid) {
      return `Verified On : ${contact.isVerifyedDate}\nVerified By : ${contact.verifiedUserName}`;
    }

    return contact.isCompleted
      ? 'Verify Report'
      : 'Test is Pending';
  }

  getCompleteTooltip(contact: any): string {
    if (contact.isCompleted) {
      return `Completed On : ${contact.reportDate}\nCompleted By : ${contact.reportCompletedUser}`;
    }
    // ${contact.reportDate} 
    return contact.isCompleted
      ? 'Completed Report'
      : 'Test is Pending';
  }
  //whatsapp
  private overlayRef: OverlayRef | null = null;
  private EmailOverlayRef: OverlayRef | null = null;
  private whatsappOverlayRef: OverlayRef | null = null;
  private hoverTimeout: any = null;
  private patientCloseTimeout: any = null;
  private doctorCloseTimeout: any = null;

  openEmailDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.EmailOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
      const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.EmailOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }
  closeEmailDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.EmailOverlayRef) {
        this.EmailOverlayRef.dispose();
        this.EmailOverlayRef = null;
      }
    }, 200);
  }
  openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.whatsappOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
      const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
      console.log(patientData)
      componentRef.instance.patientData = patientData;

      // Handle mouse events on the overlay element
      const overlayElement = this.whatsappOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }
  closeWhatsappDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.patientCloseTimeout = setTimeout(() => {
      if (this.whatsappOverlayRef) {
        this.whatsappOverlayRef.dispose();
        this.whatsappOverlayRef = null;
      }
    }, 200);
  }
  keepPatientPopoverOpenReport() {
    // Clear close timeout when hovering over popover
    if (this.patientCloseTimeout) {
      clearTimeout(this.patientCloseTimeout);
      this.patientCloseTimeout = null;
    }
  }


  getWhatsappshareReport(el) {
    console.log(el);
    this._whatsppService.OnWhatsAppMsgSent({
      mobileNo: el.mobileNo,
      patientName: el.patientName,
      billNo: el.pathTestID,
      smsType: "PathResultEntry",
      patientId: el.regNo
    })
  }

  Onemail(contact) {
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact,
          emailType: 'PathResultEntry'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  // ////////////// outsource popup //////////////////////
  // private overlayRef: OverlayRef | null = null;
  private patientOverlayRef: OverlayRef | null = null;
  // private hoverTimeout: any = null;
  private outSourceCloseTimeout: any = null;

  openPatientDetailsPopover(event: MouseEvent, outSourceData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    // Add small delay to prevent flickering
    this.hoverTimeout = setTimeout(() => {
      // Close any existing patient popover
      if (this.patientOverlayRef) {
        this.patientOverlayRef.dispose();
        this.patientOverlayRef = null;
      }

      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
          }
        ]);

      this.patientOverlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false,
      });

      const portal = new ComponentPortal(OutsourceDetailsPopoverComponent);
      const componentRef: ComponentRef<OutsourceDetailsPopoverComponent> = this.patientOverlayRef.attach(portal);
      componentRef.instance.outSourceData = outSourceData;

      // Handle mouse events on the overlay element
      const overlayElement = this.patientOverlayRef.overlayElement;
      overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
      overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
    }, 300); // 300ms delay before showing popover
  }

  closePatientDetailsPopover() {
    // Clear timeout if popover hasn't opened yet
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // Clear any existing close timeout
    if (this.outSourceCloseTimeout) {
      clearTimeout(this.outSourceCloseTimeout);
    }

    // Add delay before closing to allow moving mouse to popover
    this.outSourceCloseTimeout = setTimeout(() => {
      if (this.patientOverlayRef) {
        this.patientOverlayRef.dispose();
        this.patientOverlayRef = null;
      }
    }, 200);
  }

  keepPatientPopoverOpen() {
    // Clear close timeout when hovering over popover
    if (this.outSourceCloseTimeout) {
      clearTimeout(this.outSourceCloseTimeout);
      this.outSourceCloseTimeout = null;
    }
  }

  // ////////////// outsource popup //////////////////////
  // private overlayRef: OverlayRef | null = null;
  // private patientOverlayRef: OverlayRef | null = null;
  // private hoverTimeout: any = null;
  // private outSourceCloseTimeout: any = null;

  // openPatientDetailsPopover(event: MouseEvent, outSourceData: any) {
  //     event.stopPropagation();

  //     // Clear any existing timeout
  //     if (this.hoverTimeout) {
  //         clearTimeout(this.hoverTimeout);
  //     }

  //     // Add small delay to prevent flickering
  //     this.hoverTimeout = setTimeout(() => {
  //         // Close any existing patient popover
  //         if (this.patientOverlayRef) {
  //             this.patientOverlayRef.dispose();
  //             this.patientOverlayRef = null;
  //         }

  //         const positionStrategy = this.overlay.position()
  //             .flexibleConnectedTo(event.target as HTMLElement)
  //             .withPositions([
  //                 {
  //                     originX: 'start',
  //                     originY: 'bottom',
  //                     overlayX: 'start',
  //                     overlayY: 'top',
  //                 },
  //                 {
  //                     originX: 'start',
  //                     originY: 'top',
  //                     overlayX: 'start',
  //                     overlayY: 'bottom',
  //                 },
  //                 {
  //                     originX: 'end',
  //                     originY: 'center',
  //                     overlayX: 'start',
  //                     overlayY: 'center',
  //                 },
  //                 {
  //                     originX: 'start',
  //                     originY: 'center',
  //                     overlayX: 'end',
  //                     overlayY: 'center',
  //                 }
  //             ]);

  //         this.patientOverlayRef = this.overlay.create({
  //             positionStrategy,
  //             scrollStrategy: this.overlay.scrollStrategies.close(),
  //             hasBackdrop: false,
  //         });

  //         const portal = new ComponentPortal(OutsourceDetailsPopoverComponent);
  //         const componentRef: ComponentRef<OutsourceDetailsPopoverComponent> = this.patientOverlayRef.attach(portal);
  //         componentRef.instance.outSourceData = outSourceData;

  //         // Handle mouse events on the overlay element
  //         const overlayElement = this.patientOverlayRef.overlayElement;
  //         overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
  //         overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
  //     }, 300); // 300ms delay before showing popover
  // }

  // closePatientDetailsPopover() {
  //     // Clear timeout if popover hasn't opened yet
  //     if (this.hoverTimeout) {
  //         clearTimeout(this.hoverTimeout);
  //         this.hoverTimeout = null;
  //     }

  //     // Clear any existing close timeout
  //     if (this.outSourceCloseTimeout) {
  //         clearTimeout(this.outSourceCloseTimeout);
  //     }

  //     // Add delay before closing to allow moving mouse to popover
  //     this.outSourceCloseTimeout = setTimeout(() => {
  //         if (this.patientOverlayRef) {
  //             this.patientOverlayRef.dispose();
  //             this.patientOverlayRef = null;
  //         }
  //     }, 200);
  // }

  // keepPatientPopoverOpen() {
  //     // Clear close timeout when hovering over popover
  //     if (this.outSourceCloseTimeout) {
  //         clearTimeout(this.outSourceCloseTimeout);
  //         this.outSourceCloseTimeout = null;
  //     }
  // }

}
