import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PatientDetailsPopoverComponent } from 'app/main/opd/appointment-list/patient-details-popover/patient-details-popover.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DoctorDetailsPopoverComponent } from 'app/main/opd/appointment-list/doctor-details-popover/doctor-details-popover.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ReportDispatchComponent } from '../report-dispatch/report-dispatch.component';
import { EmailorSMSHistoryComponent } from '../emailor-smshistory/emailor-smshistory.component';
import { HomeCollectionService } from './home-collection.service';
import { NewCollectionComponent } from './new-collection/new-collection.component';

@Component({
  selector: 'app-home-collection',
  templateUrl: './home-collection.component.html',
  styleUrls: ['./home-collection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HomeCollectionComponent {
  myFilterform: FormGroup;
  f_name: any = ""
  l_name: any = ""
  Status: any = "0";
  PBillNo: any = "%";
  DoctorId: any = "0";
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

   ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  constructor(
    public _homeCollectionService: HomeCollectionService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    private overlay: Overlay,
    public formBuilder: UntypedFormBuilder,
    public _FormvalidationserviceService: FormvalidationserviceService,
    public permissionService: PagePermissionService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._homeCollectionService.CreateSearchGroup();
  }

  allcolumns = [
    // {
    //   heading: "", key: "colorPad", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 120,
    //   template: this.ColorCode
    // },
    // {
    //   heading: "Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 120,
    //   template: this.PatientTypeColorCode
    // },
    { heading: "Unit/Branch Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Date-Time", key: "regTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    { heading: "PatientNo", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 240, type: gridColumnTypes.template },
    { heading: "Type", key: "patientType1", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "B2B/Crop Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
    { heading: "Ref Doctor", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 170, type: gridColumnTypes.template },
    { heading: "Paid Amount", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Bal Amount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
    { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "CreatedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate
    }
  ]

  allfilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
    { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
    { fieldName: "DoctorId", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.LabPatientRegistration,
    apiUrl: "LabPatientRegistration/List",
    columnsList: this.allcolumns,
    sortField: "LabPatientId",
    sortOrder: 0,
    filters: this.allfilters
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
    // if (event == 'RegNo')
    //   this.myFilterform.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterform.get('PBillNo').setValue("")
    this.onChangeFirst();
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "01/01/1900"
    this.f_name = this.myFilterform.get('FirstName').value + "%"
    this.l_name = this.myFilterform.get('LastName').value + "%"
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "LabPatientRegistration/List",
      columnsList: this.allcolumns,
      sortField: "LabPatientId",

      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
    // this.GetAppointdetail();
  }

  onnew(row: any = null) {
    const dialogRef = this._matDialog.open(NewCollectionComponent,
      {
        maxWidth: "95vw",
        maxHeight: '95%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
      // this.GetAppointdetail();
    });
  }
}
