import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { ReportVerifyDetailsComponent } from 'app/main/pathology/result-entry/report-verify-details/report-verify-details.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { RadioloyOrderlistService } from '../radiology-order-list/radioloy-orderlist.service';
@Component({
  selector: 'app-radio-report-dispatch',
  templateUrl: './radio-report-dispatch.component.html',
  styleUrls: ['./radio-report-dispatch.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadioReportDispatchComponent {

  myformSearch: FormGroup;
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  status: any = "1"
  opipType: any = "3";
  page: PageNames = PageNames.PATIENT;
  pathFiles: PageNames = PageNames.PATIENT_PATHFILES;
  autocompleteModeCategoryId: string = "RadioCategory";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  @ViewChild('actionOnFirstTemplate') actionOnFirstTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionsCompleted') actionsCompleted!: TemplateRef<any>;
  @ViewChild('actionsverify') actionsverify!: TemplateRef<any>;
  @ViewChild('outSourcePopOver') outSourcePopOver!: TemplateRef<any>;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
  todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'actionOnFirst')!.template = this.actionOnFirstTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.actionsCompleted;
    this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.actionsverify;
    this.gridConfig.columnsList.find(col => col.key === 'outSourceLabName')!.template = this.outSourcePopOver;
  }

  allColumns = [
    {
      heading: "-", key: "actionOnFirst", type: gridColumnTypes.template, align: "center", width: 50,
      template: this.actionOnFirstTemplate
    },
    {
      heading: "Status", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.actionsCompleted
    },
    {
      heading: "Verify", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.actionsverify
    },
    //  { heading: "DOA", key: "visitTime", sort: true, align: 'left', emptySign: 'NA', width: 200},
    { heading: "RadDate", key: "radTime", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
    { heading: "Patient Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Admission No", key: "oP_IP_Number", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allFilters = [
    { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
    { fieldName: "IsCompleted", fieldValue: "1", opType: OperatorComparer.Equals },
    { fieldName: "OP_IP_Type", fieldValue: "3", opType: OperatorComparer.Equals },
    { fieldName: "CategoryId", fieldValue: "0", opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    apiUrl: "Radiology/RadiologyList",
    columnsList: this.allColumns,
    sortField: "RadReportId",
    sortOrder: 0,
    filters: this.allFilters
  }

  constructor(
    public _RadioloyOrderlistService: RadioloyOrderlistService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    public toastr: ToastrService,
    private overlay: Overlay,
    public _whatsppService: WhatsAppEmailService,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._RadioloyOrderlistService.filterForm()
  }

  CategoryId = "0"
  CategoryView(value) {

    if (value.value !== 0)
      this.CategoryId = value.value
    else
      this.CategoryId = "0"

    this.onChangeFirst();
  }

  onChangeFirst() {
    // debugger
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
    this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
    this.status = '1'
    this.opipType = this.myformSearch.get('PatientTypeSearch').value
    // this.regNo = this.myformSearch.get('RegNoSearch').value || 0
    this.getfilterdata();
  }

  getfilterdata() {
    // debugger
    this.gridConfig = {
      apiUrl: "Radiology/RadiologyList",
      columnsList: this.allColumns,
      sortField: "RadReportId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "Reg_No", fieldValue: String(this.regNo), opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: String(this.status), opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: String(this.opipType), opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: String(this.CategoryId), opType: OperatorComparer.Equals },
      ]

    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    //  this.CategoryId ="0"
    //  this.regNo ="0"
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'RegNoSearch')
      this.myformSearch.get('RegNoSearch').setValue("")

    this.onChangeFirst();
  }

  viewgetRadioloyTemplateReportPdf(contact) {
    debugger
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "RadReportId",
            "fieldValue": String(contact.radReportId),
            "opType": "Equals"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": String(contact.opdipdtype),
            "opType": "Equals"
          }
        ],
        "mode": "RadiologyTemplateReportWithHeader"
      }

      this._RadioloyOrderlistService.getReportView(param).subscribe(res => {

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

  getSelectedObjIP(obj) {

    console.log(obj)
    if ((obj.regID ?? 0) > 0) {
      this.regNo = obj.regID

      this.onChangeFirst();
    }
  }

  onClear() {
    this.myformSearch.get('RegNoSearch').setValue("0");
    this.myformSearch.get('StatusSearch').setValue("1");
    this.myformSearch.get('PatientTypeSearch').setValue("3");
  }

  getVerifyTooltip(contact: any): string {
    if (contact.isVerified) {
      const formattedDate = this.datePipe.transform(
        contact.isVerifyedDate,
        'dd-MM-yyyy'
      );
      return `Verified On : ${formattedDate}\nVerified By : ${contact.verifiedUserName}`;
    }
    return contact.isCompleted
      ? 'Verify Report'
      : 'Test is Pending';
  }

}
