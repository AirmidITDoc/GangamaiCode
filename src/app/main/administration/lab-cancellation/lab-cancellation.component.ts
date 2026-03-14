import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IPBrowseBillService } from 'app/main/ipd/ip-bill-browse-list/ip-browse-bill.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DateUpdateComponent } from '../paymentmodechanges/date-update/date-update.component';
import { LabCancellationService } from './lab-cancellation.service';
import { BillDateUpdateComponent } from '../cancellation/bill-date-update/bill-date-update.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lab-cancellation',
  templateUrl: './lab-cancellation.component.html',
  styleUrls: ['./lab-cancellation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabCancellationComponent {

  VReason: any = '';
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  PBillNo: any = "%"
  lable: any = '';
  CompanyId = 0
  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  billcancelList: any
  myFilterbillform: FormGroup;
  autocompleteModecompany1: string = "Company";
  autocompleteModecompany: string = "Company";
  autocompleteModeunit: string = "Hospital";
  @ViewChild('CancelReasone') CancelReasone!: TemplateRef<any>;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;

  @ViewChild('labCan', { static: false }) grid: AirmidTableComponent;
  @ViewChild('labRefund', { static: false }) grid2: AirmidTableComponent;

  @ViewChild('ColorCodeCancel') ColorCodeCancel!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('actionButtonTemplateIPRefundBill') actionButtonTemplateIPRefundBill!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.ColorCodeCancel;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPRefundBill;
  }

  constructor(
    public _CancellationService: LabCancellationService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
    public _IpBillBrowseListService: IPBrowseBillService,
  ) { }

  ngOnInit(): void {
    this.myFilterbillform = this._CancellationService.createUserFormGroup();
    this.myFilterrefundform = this._CancellationService.myFilterrefundbrowseform();
    this.myFilterbillform.get('UnitId').setValue(this._loggedService.currentUserValue.user.unitId)
  }

  allopdColumns = [
    { heading: "-", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template },
    { heading: "Bill Date", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
    { heading: "PBill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Patient Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }, //not there in payload
    { heading: "Discount Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },//not there in payload
    { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },//not there in payload
    { heading: "Balance Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
    {
      heading: "Action", key: "action", align: "right", width: 350, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  allopdFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals }, //year from 2021 to 2025
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "CompanyId", fieldValue: '0', opType: OperatorComparer.Equals },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
  ]

  // 1st table
  gridConfig: gridModel = {
    apiUrl: "LabBrowseList/LabBillList",
    columnsList: this.allopdColumns,
    sortField: "BillNo",
    sortOrder: 0,
    filters: this.allopdFilters
  }

  onChangeLabCan() {
    this.fromDate = this.datePipe.transform(this.myFilterbillform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterbillform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myFilterbillform.get('FirstName').value + "%"
    this.l_name = this.myFilterbillform.get('LastName').value + "%"
    this.regNo = this.myFilterbillform.get('RegNo').value || "0"
    this.PBillNo = this.myFilterbillform.get('PBillNo').value || "%"
    this.CompanyId = this.myFilterbillform.get('CompanyId').value || "0"
    this.UnitId = this.myFilterbillform.get('UnitId').value || "0"
    this.getfilterLabCan();
  }

  getfilterLabCan() {
    debugger
    this.gridConfig = {
      apiUrl: "LabBrowseList/LabBillList",
      columnsList: this.allopdColumns,
      sortField: "BillDate",
      sortOrder: 0,
      filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
      { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
      { fieldName: "CompanyId", fieldValue: this.CompanyId, opType: OperatorComparer.Equals },
      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  ClearfilterLabCan(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterbillform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterbillform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterbillform.get('RegNo').setValue("")
    if (event == 'PBillNo')
      this.myFilterbillform.get('PBillNo').setValue("")
    this.onChangeLabCan();
  }

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.CompanyId = value.value
    else
      this.CompanyId = 0

    this.onChangeLabCan();
  }

  OnUpdate(row) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur();
    console.log(row)
    const dialogRef = this._matDialog.open(BillDateUpdateComponent,
      {
        maxHeight: "35vh",
        maxWidth: '90vh',
        width: '100%',
        // data: row
        data: {
          data: row,
          Id: 4
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
      this.grid2.bindGridData();
    });
  }

  OnUpdatepayment(contact) {
    const dialogRef = this._matDialog.open(DateUpdateComponent,
      {
        height: "35%",
        width: '35%',
        data: contact

      });
    dialogRef.afterClosed().subscribe(result => {
    });
    this.grid.bindGridData();
    this.grid2.bindGridData();
  }

  OnSaveCancelBill() {
    if (this.VReason == '' || this.VReason == null || this.VReason == undefined) {
      this.toastr.warning('Please Enter a Reason', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    Swal.fire({
      title: 'Do you want to cancel the Final Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {

      if (result.isConfirmed) {
        let SubmitDate = {
          "billNo": this.billcancelList.billNo || 0,
          "discComments": this.VReason || ''
        }
        console.log("Json:", SubmitDate)
        this._CancellationService.LabCancelBill(SubmitDate).subscribe(response => {
          this.grid.bindGridData();
          this.lable = ''
          this.billcancelList = '';
          this._matDialog.closeAll()
        });
      }
    })
  }

  ListViewUnit1(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeLabCan();
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

  openCancelBill(element, Lable) {
    debugger
    this.lable = Lable;
    this.billcancelList = element;
    this._matDialog.open(this.CancelReasone, {
      width: '50%',
      height: '45%'
    })
  }

  ////////////////////// lab refund ////////////////
  myFilterrefundform: FormGroup;
  rf_name: any = ""
  rregNo: any = "0"
  rl_name: any = ""
  rPBillNo: any = "%"
  rrefundNo = "0"
  rfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  rtoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allOPRefundFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
    { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
    { fieldName: "RefundNo", fieldValue: "0", opType: OperatorComparer.Contains },
    { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals },
  ]

  allOPRefundColumns = [
    { heading: "Refund Date", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Payment Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name ", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplateIPRefundBill
    }
  ]

  gridConfig2: gridModel = {
    apiUrl: "LabBrowseList/LabRefundList",
    columnsList: this.allOPRefundColumns,
    sortField: "BillDate",
    sortOrder: 0,
    filters: this.allOPRefundFilters
  }

  onChangeOPRefund() {
    this.rfromDate = this.datePipe.transform(this.myFilterrefundform.get('fromDate').value, "yyyy-MM-dd")
    this.rtoDate = this.datePipe.transform(this.myFilterrefundform.get('enddate').value, "yyyy-MM-dd")
    this.rf_name = this.myFilterrefundform.get('FirstName').value + "%"
    this.rl_name = this.myFilterrefundform.get('LastName').value + "%"
    this.rregNo = this.myFilterrefundform.get('RegNo').value || "0"
    this.UnitId = this.myFilterrefundform.get('UnitId').value || "0"
    this.rrefundNo = this.myFilterrefundform.get('RefundNo').value || "0"
    this.CompanyId2 = this.myFilterrefundform.get('CompanyId').value || "0"
    this.getfilterdataOPRefund();
  }

  getfilterdataOPRefund() {
    this.gridConfig2 = {
      apiUrl: "LabBrowseList/LabRefundList",
      columnsList: this.allOPRefundColumns,
      sortField: "BillDate",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.rf_name, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.rl_name, opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.rregNo, opType: OperatorComparer.Equals },
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
        { fieldName: "RefundNo", fieldValue: this.rrefundNo, opType: OperatorComparer.Contains },
        { fieldName: "CompanyId", fieldValue: this.CompanyId2, opType: OperatorComparer.Equals },
      ]
    }
    this.grid2.gridConfig = { ...this.gridConfig2 }; // Use a new object reference
    this.grid2.bindGridData(); // Only refresh the OPRefund grid        

  }

  ClearfilterOPRefund(event) {
    console.log(event)
    if (event == 'FirstName')
      this.myFilterrefundform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterrefundform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterrefundform.get('RegNo').setValue("")
    if (event == 'RefundNo')
      this.myFilterrefundform.get('RefundNo').setValue("")

    this.onChangeOPRefund();
  }

  CompanyId2 = 0
  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.CompanyId2 = value.value
    else
      this.CompanyId2 = 0

    this.onChangeOPRefund();
  }

  ListViewUnit3(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeOPRefund();
  }
}
