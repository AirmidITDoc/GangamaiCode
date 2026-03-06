import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ComponentRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
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
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';
import { LabResultListService } from '../lab-result-list/lab-result-list.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { NewLabresultEntryComponent } from '../lab-result-list/new-labresult-entry/new-labresult-entry.component';
import { NewLabtemplateComponent } from '../lab-result-list/new-labtemplate/new-labtemplate.component';


@Component({
  selector: 'app-test-approval-list',
  templateUrl: './test-approval-list.component.html',
  styleUrls: ['./test-approval-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})


export class TestApprovalListComponent {

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
  reportlogFormGroup: FormGroup

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
    { heading: "Test Date", key: "doa", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "CategoryName", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "SampleCollectionTime", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];
  gridConfig: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "LabApproval/LabResultCompletedList",
    columnsList: this.allcolumns,
    sortField: "PathTestID",
    sortOrder: 0,
    filters: [
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
      { fieldName: "ApprovalStatus", fieldValue: "0", opType: OperatorComparer.Equals },
    ]
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    public _LabResultListService: LabResultListService,
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
    this.reportlogFormGroup = this._LabResultListService.createReportlogForm();
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
    // this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
    // this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
    this.status = this.myformSearch.get('StatusSearch').value || 0
    // this.regNo = this.myformSearch.get('RegNoSearch').value || "0"

    this.GetResultdetail();
    this.getfilterdata();
  }

  getfilterdata() {

    this.gridConfig = {
      apiUrl: "LabApproval/LabResultCompletedList",
      columnsList: this.allcolumns,
      sortField: "PathTestID",
      sortOrder: 0,
      filters: [
        // { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        // { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        // { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
        { fieldName: "ApprovalStatus", fieldValue: this.status, opType: OperatorComparer.Equals },
        // { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
        // { fieldName: "Category", fieldValue: this.Category, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
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
        this._LabResultListService.RoolbackStatus(submitData).subscribe(response => {
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
    this.OnPrintReportLogSave('Lab Print', contact) // log save

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
      this._LabResultListService.getReportView(param).subscribe(res => {
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

    if (contact.isTemplateTest) {

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
    } else {
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
          this.Printresultentry(contact);
        } else if (result.isDenied) {
          this.Printresultentrywithheader(contact);
        }
      });
    }
  }

  OP_IP_Type: any;
  CompletdFlag = 1

  Printresultentry(row: any = null) {
    // debugger
    console.log(row);
    let pathologyDelete = [];
    this.OnPrintReportLogSave('Lab Print', row) // log save

    pathologyDelete.push({ pathReportId: row.pathReportID });

    if (row.isCompleted)
      this.CompletdFlag = 1
    else
      this.CompletdFlag = 0

    pathologyDelete.push({ pathReportId: row.pathReportID });

    const submitData = {
      pathPrintResultEntry: pathologyDelete
    };

    console.log(submitData);
    if (this.CompletdFlag) {
      this._LabResultListService.PathPrintResultentryInsert(submitData).subscribe(res => {
        if (res) {
          this.viewgetPathologyTestReportPdf(row)
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
          fieldValue: "4",
          opType: "Equals"
        }
      ],
      mode: "PathologyReportWithOutHeader"
    };

    console.log(param);

    this._LabResultListService.getReportView(param).subscribe(res => {
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

  Printresultentrywithheader(row: any = null) {
    let pathologyDelete = [];
    this.OnPrintReportLogSave('Lab Print', row) // log save

    pathologyDelete.push({ pathReportId: row.pathReportID });

    const submitData = {
      pathPrintResultEntry: pathologyDelete
    };

    console.log(submitData);

    this._LabResultListService.PathPrintResultentryInsert(submitData).subscribe(res => {
      if (res) {
        this.viewgetPathologyTestReportwithheaderPdf(row)
      }
    });
  }

  viewgetPathologyTestReportwithheaderPdf(data) {

    // console.log(this.selection.selected);
    const param = {
      searchFields: [
        {
          fieldName: "OP_IP_Type",
          fieldValue: "4",
          opType: "Equals"
        }
      ],
      mode: "PathologyReportWithHeader"
    };


    console.log(param);

    this._LabResultListService.getReportView(param).subscribe(res => {
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

  chkPrintViewResultVerify(contact, flag) {
    // debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];
    this.reportPrintObj = contact

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

        const dialogRef = this._matDialog.open(NewLabresultEntryComponent,
          {
            maxWidth: "96vw",
            height: "96vh",
            width: "96%",
            data: {
              RIdData: data,
              patientdata: this.reportPrintObj,
              verifyCheck: false,
              viewCheck: true,
              sampleNo: contact.sampleNo
            }
          });
        dialogRef.afterClosed().subscribe(result => {
        });
      }, 100);
      return;
    }
  }

  chkPrintViewTemplateVerify(contact, flag) {
    // debugger
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

        const dialogRef = this._matDialog.open(NewLabtemplateComponent,
          {
            maxWidth: "75vw",
            height: '95%',
            width: '96%',
            data: {
              data: contact,
              verifyCheck: false,
              viewCheck: true,
            }
          });

        dialogRef.afterClosed().subscribe(result => {
        });
        return;
      }, 100);
      return;
    }
  }

  onViewReport(element: any) {
    // Condition check
    if (element.isCompleted && !element.isVerifyid) {
      this.OnPrintReportLogSave('Lab View', element);

      if (element.isTemplateTest == 1) {
        this.chkPrintViewTemplateVerify(element, true);
      } else {
        this.chkPrintViewResultVerify(element, true);
      }
    }
  }

  OnPrintReportLogSave(type: any, data: any) {
    // debugger
    const src = Array.isArray(data) ? data[0] : data;
    const opipid = src?.opdipdId ?? src?.opdIpdId ?? src?.opdipdId;
    if (type == 'Lab Print') {
      this.reportlogFormGroup.get('logTypeId').setValue(1);
      this.reportlogFormGroup.get('logTypeName').setValue('Lab Print');
    }
    if (type == 'Lab View') {
      this.reportlogFormGroup.get('logTypeId').setValue(2);
      this.reportlogFormGroup.get('logTypeName').setValue('Lab View');
    }
    this.reportlogFormGroup.get('opipid').setValue(opipid);

    if (!this.reportlogFormGroup.invalid) {
      console.log(this.reportlogFormGroup.value);

      this._LabResultListService.getReportLog(this.reportlogFormGroup.value).subscribe(() => {
        // this.GetSampleCollectiondetail();
      });
    } else {
      let invalidFields = [];
      if (this.reportlogFormGroup.invalid) {
        for (const controlName in this.reportlogFormGroup.controls) {
          const control = this.reportlogFormGroup.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Report Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Report Data: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  }

  AdList: boolean = false;

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
    this._LabResultListService.myformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
  }

  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;

    // return numSelected === numRows;
  }

  onClear() {
    this._LabResultListService.myformSearch.get('RegNoSearch').setValue("0");
    this._LabResultListService.myformSearch.get('StatusSearch').setValue("1");
    this._LabResultListService.myformSearch.get('PatientTypeSearch').setValue("3");
  }

  chkresultentryVerify(contact, flag) {
    debugger
    this.printdata = [];
    this.reportIdData = [];
    this.ServiceIdData = [];
    this.reportPrintObj = contact

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

        const dialogRef = this._matDialog.open(NewLabresultEntryComponent,
          {
            maxWidth: "96vw",
            height: "96vh",
            width: "96%",
            data: {
              RIdData: data,
              patientdata: this.reportPrintObj,
              verifyCheck: true,
              sampleNo: contact.sampleNo
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.grid.bindGridData();
        });
      }, 100);
      return;
    }
  }

  // onVerify(row) {
  //   Swal.fire({
  //     title: 'Confirm Verify Report ',
  //     text: 'Are you sure you want to Verify Report?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#41ea76ff',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Verify!'

  //   }).then((flag) => {
  //     // debugger
  //     if (flag.isConfirmed) {

  //       let submitData = {

  //         "pathReportId": row.pathReportID,
  //         "isVerifyid": this.accountService.currentUserValue.userId,
  //         "isVerifySign": true,
  //         "isVerifyedDate": new Date().toISOString()

  //       };
  //       console.log(submitData);
  //       this._LabResultListService.PathReportverifyMaster(submitData).subscribe(response => {
  //         this.grid.bindGridData();
  //       });
  //     }
  //   });
  //   // this.onEdit(row);
  // }

  IsTemplateTest: any;
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

        const dialogRef = this._matDialog.open(NewLabtemplateComponent,
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
          this.grid.bindGridData();
        });
        return;
      }, 100);
      return;
    }
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

  selectChangeCategoryId(obj: any) {
    console.log(obj)
    // this.CategoryId = obj;
    this.Category = obj.text;
    this.onChangeFirst()
  }

  keepPatientPopoverOpen() {
    // Clear close timeout when hovering over popover
    if (this.outSourceCloseTimeout) {
      clearTimeout(this.outSourceCloseTimeout);
      this.outSourceCloseTimeout = null;
    }
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
      "sortField": "PathTestID",
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

  viewgetReportPdf() { }
}

