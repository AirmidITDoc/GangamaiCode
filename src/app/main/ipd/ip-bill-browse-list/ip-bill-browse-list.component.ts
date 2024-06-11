import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDataStored } from '../advance';
import { IPBrowseBillService } from './ip-browse-bill.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { SmsEmailTemplateComponent } from 'app/main/shared/componets/sms-email-template/sms-email-template.component';
import { ViewIPBillComponent } from './view-ip-bill/view-ip-bill.component';
import * as converter from 'number-to-words';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-search-list/ip-advance-payment/ip-advance-payment.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { IPSettlementComponent } from '../ip-settlement/ip-settlement.component';
import { Advheaderdetail, UpdateBill } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { Router } from '@angular/router';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-ip-bill-browse-list',
  templateUrl: './ip-bill-browse-list.component.html',
  styleUrls: ['./ip-bill-browse-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillBrowseListComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;
  hasSelectedContacts: boolean;
  dataArray = {};
  currentDate = new Date();
  companyList: any = [];

  isCompanySelected: boolean = false;
  optionsCompany: any[] = [];
  filteredOptionsCompany: Observable<string[]>;
  chkprint: boolean = false;

  @ViewChild('pdfTemplate') pdfTemplate: ElementRef;
  public companyFilterCtrl: FormControl = new FormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  dataSource = new MatTableDataSource<IpBillBrowseList>();
  dataSource1 = new MatTableDataSource<ReportPrintObj>();

  @Output() showClicked = new EventEmitter();

  BrowseOPDBillsList: any;
  msg: any;
  sIsLoading: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportPrintObj: ReportPrintObj;
  reportPrintObjList: ReportPrintObj[] = [];
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  Groupname: any;
  SpinLoading: boolean = false;
  AdList: boolean = false;


  displayedColumns = [
    'SelfOrCompany',
    'InterimOrFinal',
    'BalanceAmt',
    'BillDate',
    'PBillNo',
    'RegNo',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'CashPay',
    'CardPay',
    'ChequePay',
    'OnlinePay',
    'AdvUsedPay',
    'buttons',
  ];

  menuActions: Array<string> = [];
  constructor(public _IpBillBrowseListService: IPBrowseBillService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private santitized: DomSanitizer,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private reportDownloadService: ExcelDownloadService) {

  }

  ngOnInit(): void {

    if (this._ActRoute.url == '/ipd/ipd-bill-browse-list') {
      this.menuActions.push('Print Final Bill');
      this.menuActions.push('Print FinalBill Datewise');
      this.menuActions.push('Print FinalBill WardWise');
    }


    this.getCompanyNameCombobox();

    this.onShow_IpdBrowse();
  }

  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value._filterCompany ? value._filterCompany.toLowerCase() : value.toLowerCase();
      return this.optionsCompany.filter(option => option._filterCompany.toLowerCase().includes(filterValue));
    }

  }

  // company combo list
  getCompanyNameCombobox() {
    this._IpBillBrowseListService.getCompanyMasterCombo().subscribe(data => {
      this.companyList = data;
      this.optionsCompany = this.companyList.slice();
      this.filteredOptionsCompany = this._IpBillBrowseListService.myFilterform.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.companyList.slice()),
      );

    });
  }


  getOptionTextCompany(option) {
    return option && option.CompanyName ? option.CompanyName : '';
  }


  getRecord(contact, m): void {
    if (m == "Print Final Bill") {
      if (!contact.InterimOrFinal)
        this.viewgetBillReportPdf(contact.BillNo)
      else
        this.viewgetInterimBillReportPdf(contact.BillNo)
    }
    else if (m == "Print FinalBill Datewise") {
      this.viewgetBillReportDatewisePdf(contact);
    }
    else if (m == "Print FinalBill WardWise") {
      this.viewgetBillReportwardwisePdf(contact);
    }

  }

  // SubMenu(contact) { }

  onShow(event: MouseEvent) {

    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.onShow_IpdBrowse();
      }
    }, 200);
    this.MouseEvent = true;
  }

  Billpayment(contact) {


    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = contact.BillDate;
    PatientHeaderObj['PatientName'] = contact.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
    PatientHeaderObj['RegID'] = contact.RegID;
    PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
    PatientHeaderObj['BillId'] = contact.BillNo;
    PatientHeaderObj['CompanyName'] = contact.CompanyName;

    const dialogRef = this._matDialog.open(IPSettlementComponent,
      {
        maxWidth: "95vw",
        height: '740px',
        width: '100%',
        data: {

          registerObj: contact,
          FromName: "IP-Bill"
        }
      });

    dialogRef.afterClosed().subscribe(result => {

      let updateIpBillobj = {};


      updateIpBillobj['BillNo'] = contact.BillNo;
      updateIpBillobj['BillBalAmount'] = result.submitDataPay.BalAmt || 0;

      const updateIpBill = new UpdateBill(updateIpBillobj);


      let iPsettlementAdvanceDetailUpdateobj = {};
      // need loop here

      iPsettlementAdvanceDetailUpdateobj['advanceDetailID'] = contact.BillNo;
      iPsettlementAdvanceDetailUpdateobj['usedAmount'] = 0;
      iPsettlementAdvanceDetailUpdateobj['balanceAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController

      const iPsettlementAdvanceDetailUpdate = new Advheaderdetail(iPsettlementAdvanceDetailUpdateobj);


      let iPsettlementAdvanceHeaderUpdateobj = {};

      iPsettlementAdvanceHeaderUpdateobj['advanceId'] = contact.BillNo;
      iPsettlementAdvanceHeaderUpdateobj['advanceUsedAmount'] = 0;
      iPsettlementAdvanceHeaderUpdateobj['balanceAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController

      const iPsettlementAdvanceHeaderUpdate = new UpdateBill(iPsettlementAdvanceHeaderUpdateobj);

      let CreditPaymentobj = {};
      CreditPaymentobj['paymentId'] = 0;
      CreditPaymentobj['BillNo'] = contact.BillNo;
      // CreditPaymentobj['ReceiptNo'] = '';
      CreditPaymentobj['PaymentDate'] = this.currentDate || '01/01/1900';
      CreditPaymentobj['PaymentTime'] = this.currentDate || '01/01/1900';
      CreditPaymentobj['CashPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CashPayAmount) || 0;
      CreditPaymentobj['ChequePayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.ChequePayAmount) || 0;
      CreditPaymentobj['ChequeNo'] = result.submitDataPay.ipPaymentInsert.ChequeNo || '';
      CreditPaymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName || '';
      CreditPaymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate || '01/01/1900';
      CreditPaymentobj['CardPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CardPayAmount) || 0;
      CreditPaymentobj['CardNo'] = result.submitDataPay.ipPaymentInsert.CardNo || '';
      CreditPaymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName || '';
      CreditPaymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate || '01/01/1900';
      CreditPaymentobj['AdvanceUsedAmount'] = 0;
      CreditPaymentobj['AdvanceId'] = 0;
      CreditPaymentobj['RefundId'] = 0;
      CreditPaymentobj['TransactionType'] = 0;
      CreditPaymentobj['Remark'] = result.submitDataPay.ipPaymentInsert.Remark || '';
      CreditPaymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        CreditPaymentobj['IsCancelled'] = 0;
      CreditPaymentobj['IsCancelledBy'] = 0;
      CreditPaymentobj['IsCancelledDate'] = this.currentDate;
      // CreditPaymentobj['CashCounterId'] = 0;
      // CreditPaymentobj['IsSelfORCompany'] = 0;
      // CreditPaymentobj['CompanyId'] = 0;
      CreditPaymentobj['opD_IPD_Type'] = 0;
      CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.neftPayAmount) || 0;
      CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.neftNo || '';
      CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.neftBankMaster || '';
      CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.neftDate || '01/01/1900';
      CreditPaymentobj['PayTMAmount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount || 0;
      CreditPaymentobj['PayTMTranNo'] = result.submitDataPay.ipPaymentInsert.paytmTransNo || '';
      CreditPaymentobj['PayTMDate'] = result.submitDataPay.ipPaymentInsert.PayTMDate || '01/01/1900'
      // CreditPaymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
      // CreditPaymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;

      console.log(CreditPaymentobj)
      const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);

      let Data = {
        "updateIpBill": updateIpBill,
        "ipPaymentCreditUpdat": ipPaymentInsert,
        "iPsettlementAdvanceDetailUpdate": iPsettlementAdvanceDetailUpdate,
        "iPsettlementAdvanceHeaderUpdate": iPsettlementAdvanceHeaderUpdate
      };

      console.log(Data)
      this._IpBillBrowseListService.InsertIPCreditBillingPayment(Data).subscribe(response => {
        if (response) {
          Swal.fire('IP Bill With Settlement!', 'Bill Payment Successfully !', 'success').then((result) => {
            if (result) {

              this.viewgetBillReportPdf(response)
              this._matDialog.closeAll();
              this.onShow_IpdBrowse();
            }
          });
        } else {
          Swal.fire('Error !', 'IP Billing Payment not saved', 'error');
        }

      });
    });

  }

  onClear() {

    this._IpBillBrowseListService.myFilterform.get('FirstName').reset();
    this._IpBillBrowseListService.myFilterform.get('LastName').reset();
    this._IpBillBrowseListService.myFilterform.get('RegNo').reset();
    this._IpBillBrowseListService.myFilterform.get('PBillNo').reset();
    this._IpBillBrowseListService.myFilterform.get('CompanyId').reset();
  }

  getViewbill(contact) {

    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      BillNo: contact.BillNo,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      BillDate: contact.BillDate,
      GenderName: contact.GenderName,
      RefDocName: contact.RefDocName,
      RoomName: contact.RoomName,
      BedName: contact.BedName,
      DischargeDate: contact.DischargeDate,
      PatientType: contact.PatientType,
      ServiceName: contact.ServiceName,
      Price: contact.Price,
      Qty: contact.Qty,
      NetAmount: contact.NetAmount,
      TotalAmt: contact.TotalAmt,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      PaidAmount: contact.PaidAmount,
      PayTMPayAmount: contact.PayTMPayAmount,
      CashPayAmount: contact.CashPayAmount,
      ChequePayAmount: contact.ChequePayAmount,
      NEFTPayAmount: contact.NEFTPayAmount,
      TotalAdvanceAmount: contact.TotalAdvanceAmount,
      AdvanceBalAmount: contact.AdvanceBalAmount,
      AdvanceRefundAmount: contact.AdvanceRefundAmount,
      UserName: contact.UserName,
      IPDNo: contact.IPDNo,
      AdmissionDate: contact.AdmissionDate,
    };
    this.advanceDataStored.storage = new IpBillBrowseList(xx);

    const dialogRef = this._matDialog.open(ViewIPBillComponent,
      {
        maxWidth: "90vw",
        maxHeight: "130vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


  resultsLength = 0;
  onShow_IpdBrowse() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._IpBillBrowseListService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._IpBillBrowseListService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._IpBillBrowseListService.myFilterform.get("RegNo").value || 0,
      "PBillNo": this._IpBillBrowseListService.myFilterform.get("PBillNo").value + '%' || "%",
      "Start":(this.paginator?.pageIndex??0),
      "Length":(this.paginator?.pageSize??35)
      // "IsInterimOrFinal": 2,//this._ipbillBrowseService.myFilterform.get("IsInterimOrFinal").value || "0",
      // "CompanyId": this._IpBillBrowseListService.myFilterform.get("CompanyId").value.CompanyId || 0,
    }
    console.log(D_data);
    this._IpBillBrowseListService.getIpBillBrowseList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as IpBillBrowseList[];
      this.dataSource.data = Visit["Table1"]??[] as IpBillBrowseList[];
      console.log(this.dataSource.data)
      this.resultsLength= Visit["Table"][0]["total_row"];
      this.sIsLoading = this.dataSource.data.length == 0 ? 'no-data' : '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource.data = changes.dataArray.currentValue as IpBillBrowseList[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  dummyGrpNameArr = [];
  groupWiseObj: any = {};

  viewgetBillReportPdf(BillNo) {
    setTimeout(() => {
      // this.SpinLoading =true;
      this.chkprint = true;
      this.sIsLoading = 'loading-data';

      this.AdList = true;
      this._IpBillBrowseListService.getIpFinalBillReceipt(
        BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Bill  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          // this.SpinLoading = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }

  viewgetBillReportDatewisePdf(row) {
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._IpBillBrowseListService.getIPBILLdatewisePrint(
        row.BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Bill Datewise Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }





  viewgetBillReportwardwisePdf(row) {
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._IpBillBrowseListService.getIpFinalBillwardwiseReceipt(
        row.BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Bill Ward wise Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  viewgetInterimBillReportPdf(BillNo) {
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._IpBillBrowseListService.getIpInterimBillReceipt(
        BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Interim Bill  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  exportBillDatewiseReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['SelfOrCompany', 'InterimOrFinal', 'BalanceAmt', 'BillDate', 'PBillNo', 'RegID', 'PatientName', 'TotalAmt', 'ConcessionAmt', 'NetPayableAmt', 'CashPay', 'CardPay', 'ChequePay', 'NEFTPay', 'PayTMPay', 'AdvPay'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Ip Bill Datewise');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.BillDate);
      tempObj.push(e.RegNo);
      // tempObj.push(e.DVisitDate);
      tempObj.push(e.PBillNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.TotalAmt);
      tempObj.push(e.ConcessionAmt);
      tempObj.push(e.NetPayableAmt);
      tempObj.push(e.NEFTPay);
      actualData.push(tempObj);
    });
    let headers = [['Bill Date', 'Reg ID', 'PBill No', 'Patient Name', 'Total Amt', 'Concession Amt', 'Net Payable Amt', 'NEFT Pay']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Bill');
  }
}

export class IpBillBrowseList {
  BillNo: Number;
  RegID: number;
  RegNo: number;
  PatientName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  NEFTPay: number;
  PayTMPay: number;
  BillDate: Date;
  OPD_IPD_Type: number;
  IsDischarged: number;
  IsBillGenerated: number;
  IsCancelled: boolean;
  OPD_IPD_ID: number;
  PBillNo: string;
  BDate: Date;
  DischargeDoctorName: string;
  GenderName: string;
  RefDocName: string;
  RoomName: string;
  BedName: string;
  DischargeDate: Date;
  PatientType: string;
  ServiceName: string;
  Price: number;
  Qty: number;
  NetAmount: number;
  AdvanceUsedAmount: string;
  PayTMPayAmount: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  NEFTPayAmount: number;
  TotalAdvanceAmount: number;
  AdvanceBalAmount: number;
  AdvanceRefundAmount: number;
  UserName: string;
  PaidAmount: string;
  IPDNo: number;
  AdmissionDate: Date;
  ChargesTotalAmt: number;
  GroupName: String;
  Hospitaladdress: any;
  HospitalName: any;
  InterimOrFinal: boolean;
  DoctorName: any;
  /**
   * Constructor
   *
   * @param IpBillBrowseList
   */
  constructor(IpBillBrowseList) {
    {
      this.BillNo = IpBillBrowseList.BillNo || '';
      this.RegID = IpBillBrowseList.RegID || '';
      this.RegNo = IpBillBrowseList.RegNo || '';
      this.PatientName = IpBillBrowseList.PatientName || '';
      this.FirstName = IpBillBrowseList.FirstName || '';
      this.MiddleName = IpBillBrowseList.MiddleName || '';
      this.LastName = IpBillBrowseList.LastName || '';
      this.TotalAmt = IpBillBrowseList.TotalAmt || '';
      this.ConcessionAmt = IpBillBrowseList.ConcessionAmt || '';
      this.NetPayableAmt = IpBillBrowseList.NetPayableAmt || '';
      this.NEFTPay = IpBillBrowseList.NEFTPay;
      this.PayTMPay = IpBillBrowseList.PayTMPay;
      this.BillDate = IpBillBrowseList.BillDate || '';
      this.OPD_IPD_Type = IpBillBrowseList.OPD_IPD_Type || '';
      this.IsDischarged = IpBillBrowseList.IsDischarged || '';
      this.IsBillGenerated = IpBillBrowseList.IsBillGenerated || '';
      this.IsCancelled = IpBillBrowseList.IsCancelled || '';
      this.OPD_IPD_ID = IpBillBrowseList.OPD_IPD_ID || '';
      this.PBillNo = IpBillBrowseList.PBillNo || '';
      this.BDate = IpBillBrowseList.BDate || '';
      this.DoctorName = IpBillBrowseList.DoctorName || '';
      this.DischargeDoctorName = IpBillBrowseList.DischargeDoctorName || '';
      this.GenderName = IpBillBrowseList.GenderName || '';
      this.RefDocName = IpBillBrowseList.RefDocName || '';
      this.RoomName = IpBillBrowseList.RoomName || '';
      this.BedName = IpBillBrowseList.BedName || '';
      this.DischargeDate = IpBillBrowseList.DischargeDate || '';
      this.PatientType = IpBillBrowseList.PatientType || '';
      this.ServiceName = IpBillBrowseList.ServiceName || '';
      this.Price = IpBillBrowseList.ServiceName || '';
      this.Qty = IpBillBrowseList.Qty || '';
      this.NetAmount = IpBillBrowseList.NetAmount || '';
      this.AdvanceUsedAmount = IpBillBrowseList.AdvanceUsedAmount || '';
      this.PayTMPayAmount = IpBillBrowseList.PayTMPayAmount || '';
      this.CashPayAmount = IpBillBrowseList.CashPayAmount || '';
      this.ChequePayAmount = IpBillBrowseList.ChequePayAmount || '';
      this.NEFTPayAmount = IpBillBrowseList.NEFTPayAmount || '';
      this.TotalAdvanceAmount = IpBillBrowseList.TotalAdvanceAmount || '';
      this.AdvanceBalAmount = IpBillBrowseList.AdvanceBalAmount || '';
      this.AdvanceRefundAmount = IpBillBrowseList.AdvanceRefundAmount || '';
      this.UserName = IpBillBrowseList.UserName || '';
      this.PaidAmount = IpBillBrowseList.PaidAmount || '';
      this.IPDNo = IpBillBrowseList.IPDNo || '';
      this.AdmissionDate = IpBillBrowseList.AdmissionDate || '';
      this.ChargesTotalAmt = IpBillBrowseList.ChargesTotalAmt || 0;
      this.InterimOrFinal = IpBillBrowseList.InterimOrFinal || 0;
      this.GroupName = IpBillBrowseList.GroupName || 0;
      this.Hospitaladdress = IpBillBrowseList.Hospitaladdress || ';'
      this.HospitalName = IpBillBrowseList.HospitalName || '';
    }
  }
}

export class ReportPrintObj {
  HospitalName: any;
  HospitalAddress: any;
  EmailId: any;
  Phone: any;
  IPDNo: any;
  Date: any;
  BillNo: any;
  PatientName: any;
  BillDate: any;
  Age: any;
  GenderName: any;
  AdmissionDate: any;
  AdmissionTime: any;
  DischargeDate: any;
  DischargeTime
  RefDocName: any;
  RoomName: any;
  BedName: any;
  PatientType: any;
  DepartmentName: any;
  ServiceName: any;
  Price: any;
  Qty: any;
  ChargesTotalAmt: any;
  TotalAmt: any;
  AdvanceUsedAmount: any;
  PaidAmount: any;
  PayTMPayAmount: any;
  CashPayAmount: any;
  ChequePayAmount: any;
  NEFTPayAmount: any;
  TotalAdvanceAmount: any;
  AdvanceBalAmount: any;
  AdvanceRefundAmount: any;
  AddedByName: any;
  NetAmount: any;
  GroupName: String;
  NetPayableAmt: any;
  AdvanceAmount: any;
  TotalBillAmt: any;
  ConcessionAmt: any;
  ChargesDoctorName: string;
  AdmittedDoctorName: String;
  BalanceAmt: any;
  AgeMonth: any;
  AgeDay: any;
  Hospitaladdress: any;
  PaymentDate: any;
  RegId: any;
  Doctorname: any;
  TariffName: any;
  AdvanceNo: any;
  PaymentTime: any;
  BalanceAmount: any;
  UsedAmount: any;
  ChargesDate: any;
}

