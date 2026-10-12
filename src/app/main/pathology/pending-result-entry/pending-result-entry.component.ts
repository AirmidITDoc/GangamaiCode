import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { ResultEntryService } from '../result-entry/result-entry.service';
import { PatientList, SampleDetailObj, SampleList } from '../result-entry/result-entry.component';
import { NewResultTemplateComponent } from '../result-entry/new-result-template/new-result-template.component';
import { NewResultEntryComponent } from '../result-entry/new-result-entry/new-result-entry.component';
import { OutsourceDetailsPopoverComponent } from '../result-entry/outsource-details-popover/outsource-details-popover.component';
import { OutsourceDetailsComponent } from '../result-entry/outsource-details/outsource-details.component';
import { NewPendingResultentryComponent } from './new-pending-resultentry/new-pending-resultentry.component';

@Component({
  selector: 'app-pending-result-entry',
  templateUrl: './pending-result-entry.component.html',
  styleUrls: ['./pending-result-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PendingResultEntryComponent {
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
  IsSamRequired: boolean = true;
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
  patientName: any = "%"
  regNo: any = "0"
  testName: any = "0"
  vTestId: any = "0"
  age = ''
  gendername = ''
  status: any = "0"
  opipType: any = "2";
  IsTemplateTest: any;
  vStatusSearch: any = "0";
  vCategoryId: any;
  // patientName: 'RK'
  title: 'Reports'
  page: PageNames = PageNames.PATIENT;
  pathFiles: PageNames = PageNames.PATIENT_PATHFILES;
  autocompleteModeunit: string = "Hospital";
  autocompleteModeCategoryName: string = "PathCategory";
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  isSuperAdmin: any = this.accountService.currentUserValue.user.isAdminMultiview;
  private EmailOverlayRef: OverlayRef | null = null;
  private whatsappOverlayRef: OverlayRef | null = null;
  private hoverTimeout: any = null;
  private patientCloseTimeout: any = null;
  totalRecords = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [25, 50, 120, 200];

  IsEdit: boolean = true; ///this.permissionService.getPermission(permissionCodes.Pathology, permissionType.Edit);
  IsDelete: boolean = this.permissionService.getPermission(permissionCodes.PathologyResultlist, permissionType.Delete);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // dataSource = new MatTableDataSource<PatientList>();
  dataSource1 = new MatTableDataSource<SampleList>();
  selection = new SelectionModel<SampleList>(true, []);

  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  displayedColumns1: string[] = [
    'select',
    'opiptype',
    'status',
    'verify',
    'regNo',
    'patientName',
    'CategoryName',
    'TestName',
    'SampleCollectionTime',
    'SampleNo',
    'outSourceLabName',
    'action'
  ];
  OP_IP_Type: any;
  selectedItem: any;
  CompletdFlag = 1
  OPIPID: any = 0;

  hasSelectedContacts: boolean;
  IsSampleCollectionCheckon: boolean = false;
  SampleMessage = ''
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
  todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

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
    public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay, private _configue: ConfigService,
    public permissionService: PagePermissionService,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._SampleService.createPendingSearchForm()
    this.fromDate = this.myformSearch.get("start").value || "";
    this.toDate = this.myformSearch.get("end").value || "";
    this.GetResultdetail();


    const rawValue = this?._configue?.configParams?.IsSampleCollectionRequired || "";
    const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
    this.IsSampleCollectionCheckon = id === "1";

    if (this.IsSampleCollectionCheckon) {
      this.IsSamRequired = false
      this.SampleMessage = "Result will be generated without sample collection."
    }
    else {
      this.IsSamRequired = true
      this.SampleMessage = "Sample collection is required to generate the result."
    }
  }

  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.GetResultdetail();
  }

  ListViewTest(value) {
    console.log(value)
    if (value.value !== 0)
      this.vTestId = value.serviceId
    else
      this.vTestId = 0

    this.GetResultdetail();
  }

  CategoryView(value) {
    if (value.value !== 0)
      this.vCategoryId = value.value
    else
      this.vCategoryId = 0

    this.GetResultdetail();
  }

  // onChangeFirst() {
  //   this.dataSource1.data = [];

  //   this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
  //   this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
  //   this.patientName = this.myformSearch.get('patientName').value + "%"
  //   this.testName = this.myformSearch.get('TestId').value || '0'
  //   this.status = this.myformSearch.get('StatusSearch').value
  //   this.opipType = this.myformSearch.get('opiptype').value || '2'
  //   this.regNo = this.myformSearch.get('RegNoSearch').value || "0"

  //   // this.GetResultdetail();
  //   // this.getfilterdata();
  // }

  Clearfilter(event) {
    console.log(event)
    if (event == 'RegNoSearch')
      this.myformSearch.get('RegNoSearch').setValue("0")

    if (event == 'patientName')
      this.myformSearch.get('patientName').setValue("")

    this.GetResultdetail();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.GetResultdetail();
  }

  onPatientTypeChange(event: any) {
    const type = event.value ?? '2';
    this.myformSearch.get('opiptype').setValue(type, { emitEvent: false });

    this.GetResultdetail();
  }

  onStatusChange(event: any) {
    const type = event.value ?? '0';
    this.myformSearch.get('StatusSearch').setValue(type, { emitEvent: false });

    this.GetResultdetail();
  }

  GetResultdetail(obj: any = null) {

    const start = this.myformSearch.get('start').value;
    const end = this.myformSearch.get('end').value;
    if (!start || !end) return;                       // NEW: wait until both dates are picked

    this.fromDate = this.datePipe.transform(start, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(end, "yyyy-MM-dd")
    this.Vtotalcount = 0;
    this.VCompletedcount = 0;
    this.Vpendingcount = 0;
    this.patientName = (this.myformSearch.get('patientName').value ?? '') + "%"   // CHANGED
    this.testName = this.myformSearch.get('TestId').value || '0'
    this.status = this.myformSearch.get('StatusSearch').value
    this.opipType = this.myformSearch.get('opiptype').value ?? '2'                // CHANGED: || to ??
    this.regNo = this.myformSearch.get('RegNoSearch').value || "0"
    this.vCategoryId = this.myformSearch.get('CategoryId').value || 0

    const data =
    {
      "first": 0,
      "rows": 9999,
      "sortField": "PathReportID",
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
          "fieldName": "PatientName",
          "fieldValue": String(this.patientName),
          "opType": "Equals"
        },
        {
          "fieldName": "TestName",
          "fieldValue": String(this.testName),
          "opType": "Equals"
        },
        {
          "fieldName": "RegNo",
          "fieldValue": String(this.regNo),
          "opType": "Equals"
        },
        {
          "fieldName": "OPIPType",
          "fieldValue": String(this.opipType || "2"),
          "opType": "Equals"
        },
        {
          "fieldName": "IsCompleted",
          "fieldValue": String(this.status),
          "opType": "Equals"
        },
        {
          "fieldName": "CategoryId",
          "fieldValue": String(this.vCategoryId || "0"),
          "opType": "Equals"
        },
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._SampleService.getresultenteryDetlist(data).subscribe((response) => {

      // 1. drop the old ticked rows, they belong to the previous list
      this.selection.clear();
      this.reportPrintObj = null;
      this.advanceDataStored.storage = null;

      this.dataSource1.data = response.data;
      console.log(this.dataSource1.data)
      if (this.dataSource1.data.length > 0) {
        this.Vtotalcount = this.dataSource1.data.length
        this.dataSource1.data.forEach(element => {
          // debugger
          if (element.isCompleted == true) {
            this.VCompletedcount = this.VCompletedcount + 1;
          } else if (element.isCompleted == false) {
            this.Vpendingcount = this.Vpendingcount + 1;
          }

        });
      }
      this.totalRecords = this.dataSource1.data.length > 0
        ? this.dataSource1.data[0].total_Row
        : 0;
    });
  }

  onClear() {
    this._SampleService.myformSearch.get('RegNoSearch').setValue("0");
    this._SampleService.myformSearch.get('StatusSearch').setValue("0");
    this._SampleService.myformSearch.get('opiptype').setValue("2");
  }

  masterToggle() {
    debugger
    const totalTests = this.dataSource1.data.length;
    const collectedTests = this.dataSource1.data.filter(
      (row: any) => !this.isCheckboxDisabled(row)
    );
    const notCollectedCount = totalTests - collectedTests.length;

    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : collectedTests.forEach(row => this.selection.select(row));
    }

    console.log('Selected items count:', this.selection.selected.length);
    this.resultSource = [...this.selection.selected];
    console.log('Selected items:', this.resultSource);

    this.reportPrintObj = this.selection.selected[0] as any;
  }

  isSomeSelected() {
    const selectableRows = this.dataSource1.data.filter(
      row => !this.isCheckboxDisabled(row)
    );
    // console.log(this.selection.selected);
    return this.selection.selected.length > 0 &&
      this.selection.selected.length < selectableRows.length;
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

  onSearchClear() {
    this._SampleService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  isAllSelected() {
    const selectableRows = this.dataSource1.data.filter(
      row => !this.isCheckboxDisabled(row)
    );
    const numSelected = this.selection.selected.length;
    const numRows = selectableRows.length; //    this.dataSource1.data.length;

    return numSelected === numRows;
  }
  isCheckboxDisabled(contact: any): boolean {
    if (contact.isRefunded == 1) {
      return true
    }
    if (contact.isSampleCollection === 'False') {
      return true
    }
    return false; // Self patient → always enabled
  }

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
          const data = [];

          this.selection.selected.forEach(element => {
            console.log(element)
            data.push({
              PathReportId: element["pathReportID"].toString(),
              ServiceId: element["pathTestID"].toString(),
              IsCompleted: element["isCompleted"].toString()
            });
            this.printdata.push({ PathReportId: element["pathReportID"].toString() });
          });

          console.log(this.printdata)
          data.forEach((element) => {
            console.log('aaaaaa:', element)
            this.reportIdData.push(element.pathReportID)
            this.ServiceIdData.push(element.pathTestID)
            if (element.IsCompleted == "true")
              this.Iscompleted = 1;
          });

          const dialogRef = this._matDialog.open(NewPendingResultentryComponent,
            {
              maxWidth: "96vw",
              height: "96vh",
              width: "96%",
              data: {
                RIdData: data,
                patientdata: this.reportPrintObj,
                sampleNo: contact[0].sampleNo
              }
            });
          dialogRef.afterClosed().subscribe(result => {
            // this.grid.bindGridData();
            // this.getSelectedRow(this.SelectedrowObj);
            this.GetResultdetail();
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
          data: {
            data: contact,
            verifyCheck: false
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Pathology Template  Saved ..', result);
        this.GetResultdetail();
      });
      return;
    }
    const allCompleted =
      this.dataSource1.data.length > 0 && this.dataSource1.data.every(element => element?.isCompleted === true);
    if (allCompleted) { this.GetResultdetail(); }
  }

  Printresultentry(row: any = null) {
    debugger
    console.log(row);
    console.log(this.selection.selected);
    const pathologyDelete = [];

    this.selectedItem = this.selection.selected[0];

    this.selection.selected.forEach((element) => {
      if (element?.isCompleted) {
        this.CompletdFlag = 1
        pathologyDelete.push({ pathReportId: element.pathReportID });
      }
      else {
        this.CompletdFlag = 0
      }
    });
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
    debugger
    const param = {
      searchFields: [
        {
          fieldName: "OP_IP_Type",
          fieldValue: String(data.opdipdtype),
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
    const pathologyDelete = [];

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
          fieldValue: String(data.opdipdtype),
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
  }

  onresultentryshow(event, m) {
    // debugger
    console.log("2nd Table Data:", m)
    this.OPIPID = m.opdipdid //m.OPD_IPD_ID
    this.reportPrintObj = m;
    this.reportPrintObj["DOA"] = m.pathDate
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

        const submitData = {
          "pathReportID": row.pathReportID
        };
        console.log(submitData);
        this._SampleService.RoolbackStatus(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Data Updated Successfully !', 'success').then((result) => {
              this._matDialog.closeAll();
              // this.grid.bindGridData();
              this.dataSource1.data = [];
              this.GetResultdetail();
            });
          } else {
            Swal.fire('Error !', 'Pathology Resulentry data not Updated', 'error');
          }

        });
      }
    });
  }

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

  chkresultentryEdit(contact, flag) {
    debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];

    if (flag)
      this.IsTemplateTest = contact.isTemplateTest

    this.reportPrintObj = contact;
    console.log(contact)
    if (this.IsTemplateTest == 0) {
      setTimeout(() => {
        const data = [];
        const contactArray = Array.isArray(contact) ? contact : [contact];
        contactArray.forEach(element => {
          console.log(element)
          data.push({
            PathReportId: element["pathReportID"].toString(),
            ServiceId: element["pathTestID"].toString(),
            IsCompleted: element["isCompleted"].toString()
          });
          this.printdata.push({ PathReportId: element["pathReportID"].toString() });
        });

        console.log(this.printdata)
        data.forEach((element) => {
          console.log('aaaaaa:', element)
          this.reportIdData.push(element.pathReportID)
          this.ServiceIdData.push(element.pathTestID)
          if (element.IsCompleted == "true")
            this.Iscompleted = 1;
        });

        const dialogRef = this._matDialog.open(NewPendingResultentryComponent,
          {
            maxWidth: "96vw",
            height: "96vh",
            width: "96%",
            data: {
              RIdData: data,
              patientdata: this.reportPrintObj,
              sampleNo: contact.sampleNo
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.grid.bindGridData();
          // this.getSelectedRow(event);
          this.GetResultdetail();
        });
      }, 100);
      return;
    }
    this.GetResultdetail()
    this.selection.clear(); // Clears all selected items
    this.dataSource1.data = [];
  }

  Editoutsoucedata(row) {
    console.log(row)

    this.advanceDataStored.storage = new AdvanceDetailObj(row);

    const dialogRef1 = this._matDialog.open(OutsourceDetailsComponent,
      {
        maxWidth: "80vw",
        width: "45%",
        height: "60%",
        data: row
      });

    dialogRef1.afterClosed().subscribe(result => {
      // this.grid.bindGridData();
      // this.getSelectedRow(event);
    });
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
            fieldValue: String(contact.opdipdtype),
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

        const submitData = {

          "pathReportId": row.pathReportID,
          "isVerifyid": this.accountService.currentUserValue.userId,
          "isVerifySign": true,
          "isVerifyedDate": new Date().toISOString()

        };
        console.log(submitData);
        this._SampleService.PathReportverifyMaster(submitData).subscribe(response => {
          // this.getSampledetailList1(event);
          this.GetResultdetail();
        });
      }
    });
  }

  // ////////////// outsource popup //////////////////////

  private patientOverlayRef: OverlayRef | null = null;
  private outSourceCloseTimeout: any = null;

  openPatientDetailsPopover(event: MouseEvent, outSourceData: any) {
    event.stopPropagation();

    // Clear any existing timeout
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

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
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    if (this.outSourceCloseTimeout) {
      clearTimeout(this.outSourceCloseTimeout);
    }

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
}
