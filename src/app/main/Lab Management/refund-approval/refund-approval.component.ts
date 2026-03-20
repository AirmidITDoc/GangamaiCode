import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ComponentRef } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NursingPathRadRequestList } from 'app/main/pathology/sample-request/sample-request.component';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { RefundApprovalService } from './refund-approval.service';

@Component({
  selector: 'app-refund-approval',
  templateUrl: './refund-approval.component.html',
  styleUrls: ['./refund-approval.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RefundApprovalComponent {
  myformSearch: FormGroup;
  autocompleteModeunit: string = "Hospital";
  autocompleteModecompany: string = "Company";
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  vOPIPId = 0;
  f_name: any = "%"
  regNo: any = "0"
  l_name: any = "%"
  status: any = "0"
  vCompanyId: any = "0"
  VPBillNo = "%"
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;
  approvalFormFinal: FormGroup;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.firstActionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'isApproval')!.template = this.isApprovalstatus;
  }
  @ViewChild('isApprovalstatus') isApprovalstatus!: TemplateRef<any>;
  @ViewChild('firstActionButtonTemplate') firstActionButtonTemplate!: TemplateRef<any>;
  @ViewChild('statusForm') statusForm!: TemplateRef<any>;

  allcolumns = [
    { heading: "Status", key: "isApproval", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template },
    { heading: "PBill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Date-Time", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Patient Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 120 },
    { heading: "Comment", key: "comment", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Approved Date", key: "approvalDatetime", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
    { heading: "Approved By", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    {
      heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
      template: this.firstActionButtonTemplate
    }
  ];
  gridConfig: gridModel = {
    apiUrl: "RefundOfBill/LabRefundApprovedList",
    columnsList: this.allcolumns,
    sortField: "RefundId",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "IsApproved", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
    ]
  }

  constructor(public _refundApprovalService: RefundApprovalService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,private _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public permissionService: PagePermissionService,
    private overlay: Overlay,) { }

  ngOnInit(): void {
    this.myformSearch = this.createSearchForm()
    // this.GetSampleCollectiondetail()
    this.approvalFormFinal = this._refundApprovalService.CreateForm();

    this.myformSearch.get('UnitId').setValue(this._loggedService.currentUserValue.user.unitId)
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: [],
      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      // BillNo:[''],
      // BillDate:[''],
      PatientTypeSearch: ['5'],
      StatusSearch: ['0'],
      Istype: ['2'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      PBillNo: '',
      CompanyId: 0,
      UnitId: [this._loggedService.currentUserValue.user.unitId]
    });
  }

  ListViewcompany(value) {
    console.log(value)
    if (value.value !== 0)
      this.vCompanyId = value.value
    else
      this.vCompanyId = 0

    this.onChangeFirst();
  }

  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    // this.onChangeFirst();
  }

  onChangeFirst() {
    // debugger
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    this.f_name = this.myformSearch.get('FirstName').value + "%"
    this.l_name = this.myformSearch.get('LastName').value + "%"
    this.regNo = this.myformSearch.get('RegNo').value || "0"
    this.status = this.myformSearch.get('StatusSearch').value
    this.VPBillNo = this.myformSearch.get('PBillNo').value || "%"
    this.vCompanyId = this.myformSearch.get('CompanyId').value || "0"
    this.getfilterdata();
  }

  getfilterdata() {
    // debugger
    this.gridConfig = {
      apiUrl: "RefundOfBill/LabRefundApprovedList",
      columnsList: this.allcolumns,
      sortField: "RefundId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsApproved", fieldValue: this.status, opType: OperatorComparer.Equals },
        { fieldName: "CompanyId", fieldValue: String(this.vCompanyId), opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: String(this.VPBillNo), opType: OperatorComparer.StartsWith },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myformSearch.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myformSearch.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myformSearch.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myformSearch.get('PBillNo').setValue("")

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

  patientName: string = '';
  refundId: any;
  openStatus(row: any = null): void {
    console.log(row)
    this.patientName = row?.firstName || '';
    this.refundId = row.refundId

    const dialogRef = this._matDialog.open(this.statusForm, {
      width: '35%',
      height: '40%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }

  saveStatus() {
    this.approvalFormFinal.get('refundId').setValue(this.refundId)

    if (!this.approvalFormFinal.value.isApproval) {
      this.toastr.warning('Please approve before saving');
      return; // stop save
    }

    if (!this.approvalFormFinal.invalid) {
      console.log(this.approvalFormFinal.value)

      this._refundApprovalService.statusUpdate(this.approvalFormFinal.value).subscribe((response) => {
        this.onClear();
      });
    } {
      const invalidFields = [];
      if (this.approvalFormFinal.invalid) {
        for (const controlName in this.approvalFormFinal.controls) {
          if (this.approvalFormFinal.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }

  onClear() {
    this.approvalFormFinal.reset();
    this._matDialog.closeAll();
  }
}
