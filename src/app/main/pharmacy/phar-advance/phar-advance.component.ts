import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { NewAdvanceComponent } from './new-advance/new-advance.component';
import { NewIPRefundAdvanceComponent } from './new-iprefund-advance/new-iprefund-advance.component';
import { PharAdvanceService } from './phar-advance.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormGroup } from '@angular/forms';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-phar-advance',
  templateUrl: './phar-advance.component.html',
  styleUrls: ['./phar-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PharAdvanceComponent implements OnInit {

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  myFilterform: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;
  @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
  @ViewChild('grid1', { static: false }) grid1: AirmidTableComponent;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  PBillNo: any = "0"
  storeId: any = this._loggedService.currentUserValue.user.storeId

  fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  f_name1: any = ""
  regNo1: any = "0"
  l_name1: any = ""
  storeId1: any = this._loggedService.currentUserValue.user.storeId

  constructor(
    public _PharAdvanceService: PharAdvanceService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._PharAdvanceService.CreaterSearchForm();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  allfilters1 = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "StoreId", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
  ]

  allColumns1 = [
    { heading: "RefundDate", key: "date", sort: true, align: 'left', emptySign: 'NA', type: 9 },
    { heading: "RefundNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Refund Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPay Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "ChequePay Amt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CardPay Amt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.print, callback: (data: any) => {
            // this.onSave(data) // EDIT Records
          }
        }]
    }
  ]

  gridConfig: gridModel = {
    apiUrl: "Sales/BrowseIPPharAdvanceReceiptList",
    columnsList: this.allColumns1,
    sortField: "StoreId",
    sortOrder: 0,
    filters: this.allfilters1
  }

  onChangeGrid() {
    debugger
    this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
    this.f_name = this.myFilterform.get('FirstName').value + "%"
    this.l_name = this.myFilterform.get('LastName').value + "%"
    this.regNo = this.myFilterform.get('RegNo').value || "0"
    this.PBillNo = this.myFilterform.get('AdvanceNo').value || "0"
    // this.storeId = this.myFilterform.get('IsInterimOrFinal').value
    this.getfilterGrid();
  }

  getfilterGrid() {
    this.gridConfig = {
      apiUrl: "Sales/BrowseIPPharAdvanceReceiptList",
      columnsList: this.allColumns1,
      sortField: "StoreId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
      ]
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  ClearfilterGrid(event) {
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterform.get('RegNo').setValue("")
    if (event == 'AdvanceNo')
      this.myFilterform.get('AdvanceNo').setValue("")
    this.onChangeGrid();
  }

  allfilters2 = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
    { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "StoreId", fieldValue: String(this.storeId1), opType: OperatorComparer.Equals }
  ]

  allColumns2 = [
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', type: 9 },
    { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPay Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "ChequePay Amt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CardPay Amt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.print, callback: (data: any) => {
            // this.onSave(data) // EDIT Records
          }
        }]
    }
  ]

  gridConfig1: gridModel = {
    apiUrl: "Sales/PhAdvRefundReceiptList",
    columnsList: this.allColumns2,
    sortField: "RefundId",
    sortOrder: 0,
    filters: this.allfilters2
  }

  onChangeGrid1() {
    debugger
    this.fromDate1 = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    this.toDate1 = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
    this.f_name1 = this.myFilterform.get('FirstName').value + "%"
    this.l_name1 = this.myFilterform.get('LastName').value + "%"
    this.regNo1 = this.myFilterform.get('RegNo').value || "0"
    this.getfilterGrid1();
  }

  getfilterGrid1() {
    this.gridConfig1 = {
      apiUrl: "Sales/PhAdvRefundReceiptList",
      columnsList: this.allColumns2,
      sortField: "RefundId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.f_name1, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name1, opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo1, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.storeId1), opType: OperatorComparer.Equals }
      ]
    }
    console.log(this.gridConfig1)
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }

  ClearfilterGrid1(event) {
    if (event == 'FirstName')
      this.myFilterform.get('FirstName').setValue("")
    else
      if (event == 'LastName')
        this.myFilterform.get('LastName').setValue("")
    if (event == 'RegNo')
      this.myFilterform.get('RegNo').setValue("")
    if (event == 'AdvanceNo')
      this.myFilterform.get('AdvanceNo').setValue("")
    this.onChangeGrid1();
  }

  newAdvance() {
    const dialogRef = this._matDialog.open(NewAdvanceComponent,
      {
        maxWidth: "95vw",
        maxHeight: '95vh',
        height: '90%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.grid.bindGridData();
      // this.getIPAdvanceList();
    });
  }
  newAdvanceRef() {
    const dialogRef = this._matDialog.open(NewIPRefundAdvanceComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '70%'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getIPAdvanceRefundList();
      this.grid1.bindGridData();
    });
  }


  viewgetIPAdvanceReportPdf(contact) {


    this.sIsLoading = 'loading-data';
    setTimeout(() => {

      this._PharAdvanceService.getViewPahrmaAdvanceReceipt(
        contact.AdvanceDetailID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Advance Receipt Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
      });

    }, 100)

  }




  viewgetRefundofAdvanceReportPdf(contact) {

    this.sIsLoading = 'loading-data';
    setTimeout(() => {

      this._PharAdvanceService.getViewPahrmaRefundAdvanceReceipt(
        contact
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma Refund Of Advance Receipt Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
      });

    }, 100)

  }


  currentDate = new Date();
  getWhatsappsAdvance(el, vmono) {

    if (vmono != '' && vmono != "0") {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber": vmono || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'IPPharmaAdvance',
          "smsFlag": 0,
          "smsDate": this.currentDate,
          "tranNo": el,
          "PatientType": 2,//el.PatientType,
          "templateId": 0,
          "smSurl": "info@gmail.com",
          "filePath": '',
          "smsOutGoingID": 0
        }
      }
      this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
        if (response) {
          this.toastr.success('IP Pharma Advance Receipt Sent on WhatsApp Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error WhatsApp!', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }
}
export class IPAdvanceList {

  Date: any;
  AdvanceNo: number;
  RegNo: number;
  PatientName: string;
  AdvanceAmount: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: any;
  UserName: any;
  IGST: any;

  constructor(IPAdvanceList) {
    {
      this.Date = IPAdvanceList.Date || 0;
      this.AdvanceNo = IPAdvanceList.AdvanceNo || 0;
      this.RegNo = IPAdvanceList.RegNo || 0;
      this.PatientName = IPAdvanceList.PatientName || '';
      this.AdvanceAmount = IPAdvanceList.AdvanceAmount || 0;
      this.CashPayAmount = IPAdvanceList.CashPayAmount || 0;
      this.ChequePayAmount = IPAdvanceList.ChequePayAmount || 0;
      this.CardPayAmount = IPAdvanceList.CardPayAmount || 0;
      this.UserName = IPAdvanceList.UserName || '';
      this.IGST = IPAdvanceList.IGST || 0;
    }
  }
}
export class IPAdvanceRefList {

  RefundDate: any;
  RefundNo: any;
  RegNo: any;
  PatientName: string;
  RefundAmount: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: any;
  Remark: any;
  AddedBy: any;

  constructor(IPAdvanceRefList) {
    {
      this.RefundDate = IPAdvanceRefList.RefundDate || 0;
      this.RefundNo = IPAdvanceRefList.RefundNo || 0;
      this.RegNo = IPAdvanceRefList.RegNo || 0;
      this.PatientName = IPAdvanceRefList.PatientName || '';
      this.RefundAmount = IPAdvanceRefList.RefundAmount || 0;
      this.CashPayAmount = IPAdvanceRefList.CashPayAmount || 0;
      this.ChequePayAmount = IPAdvanceRefList.ChequePayAmount || 0;
      this.CardPayAmount = IPAdvanceRefList.CardPayAmount || 0;
      this.Remark = IPAdvanceRefList.Remark || '';
      this.AddedBy = IPAdvanceRefList.AddedBy || '';
    }
  }
}
