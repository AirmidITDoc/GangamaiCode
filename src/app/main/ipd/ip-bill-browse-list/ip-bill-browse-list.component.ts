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
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { BrowseIpdPaymentReceipt } from '../browse-ipdpayment-receipt/ipd-paymentreceipt/ipd-paymentreceipt.component';
import { RefundMaster } from '../Refund/ip-refund/ip-browse-refundof-bill/ip-browse-refundof-bill.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { DiscountAfterFinalBillComponent } from '../ip-search-list/discount-after-final-bill/discount-after-final-bill.component';
import { ToastrService } from 'ngx-toastr';

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
  vMobileNo:any;

  displayedColumns = [
    // 'SelfOrCompany',
    // 'InterimOrFinal',
    // 'BalanceAmt',
    'UserAction',
    'BillDate',
    'PBillNo',
    'RegNo',
    'PatientName',
    'Age',
    'MobileNo',
    'DOA',
    'DOD',
    'IPDNo',
    'DoctorName',
    'RefDoctorName',
    'TariffName',
    'CompanyName',
    'UnitName',
    'TotalAmt',
    'ConcessionAmt',
    'CompDiscAmt',
    'NetPayableAmt',
    'BalanceAmt',
    'CashPay',
    'CardPay',
    'ChequePay',
    'OnlinePay',
    'AdvanceUsedAmount',
    'PayCount',
    'RefundAmount',
    // 'RefundCount',
    'CashCounterName',
    'UserName',
    'buttons',
  ];

  displayedColumns2 = [
    // 'checkbox', 
    'PBillNo',
    'RegNo',
    'PatientName',
    // 'ReceiptNo',
    // 'PayDate',
    'TotalAmt',
    'BalanceAmt',
    'PaymentDate',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'PaidAmount',
    'NEFTPayAmount',
    'PayTMAmount',
    'Remark',
    'UserName',
    'buttons'
  ];
  dataSource2 = new MatTableDataSource<BrowseIpdPaymentReceipt>();
  
  displayedColumns3 = [ 
    'RefundDate',
    'RegNo',
    // 'RefundId',
    // 'BillId',
    'PatientName',
    // 'PaymentDate',
    'RefundAmount',
    'TotalAmt', 
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'Remark',
    'buttons'
  
    
    // 'action'
  ];
  dataSource3 = new MatTableDataSource<RefundMaster>();

  menuActions: Array<string> = [];
  constructor(public _IpBillBrowseListService: IPBrowseBillService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private santitized: DomSanitizer,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private reportDownloadService: ExcelDownloadService,
    public toastr: ToastrService,
    public _WhatsAppEmailService:WhatsAppEmailService
  ) {

  }

  ngOnInit(): void {

    if (this._ActRoute.url == '/ipd/ipd-bill-browse-list') {
      this.menuActions.push('Print Final Bill Classwise');
      this.menuActions.push('Print FinalBill Classwise');
      // this.menuActions.push('Print FinalBill Datewise');
      // this.menuActions.push('Print FinalBill WardWise');
    }

    this.getBrowseIPDPaymentReceiptList();
    this.getCompanyNameCombobox();
    this.getBrowseIPDRefundbillList(); 
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
      this.filteredOptionsCompany = this._IpBillBrowseListService.myFilterIpbillbrowseform.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.companyList.slice()),
      );

    });
  }


  getOptionTextCompany(option) {
    return option && option.CompanyName ? option.CompanyName : '';
  }


  getRecord(contact, m): void {
   
      // if (!contact.InterimOrFinal)
      //   this.viewgetBillReportPdf(contact.BillNo)
      // else
      //   this.viewgetInterimBillReportPdf(contact.BillNo)
  
  }
  getRecord1(contact, m): void {
    if (m == "Print Final Bill") 
      if (!contact.InterimOrFinal)
        this.viewgetBillReportPdf(contact.BillNo)
      else
        this.viewgetInterimBillReportPdf(contact.BillNo)
  
  if (m == "Print FinalBill Classwise") 
    this.viewgetBillReportclasswisePdf(contact)
    if (m == "Print FinalBill Datewise") 
      this.viewgetBillReportDatewisePdf(contact)
      if (m == "Print FinalBill WardWise") 
        this.viewgetBillReportwardwisePdf(contact)
  }
  
  

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

  onShow1(event: MouseEvent) {
 
    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.getBrowseIPDPaymentReceiptList();
      }
    }, 50);
    this.MouseEvent = true;
  }
  onShow2(event:MouseEvent)
{   
  //debugger;
 
  this.click=!this.click;
   setTimeout(() => {
     {
      this.sIsLoading = 'loading-data';
      this.getBrowseIPDRefundbillList(); 
    }
  }, 50);
  this.MouseEvent=true;
}


  Billpayment(contact) {

    console.log(contact)
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = contact.BillDate;
    PatientHeaderObj['PatientName'] = contact.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
    PatientHeaderObj['MobileNo'] = contact.MobileNo;
    PatientHeaderObj['PatientAge'] = contact.PatientAge;
    PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
    PatientHeaderObj['BillId'] = contact.BillNo;
    PatientHeaderObj['CompanyName'] = contact.CompanyName;
    PatientHeaderObj['RegNo'] = contact.RegNo;
    PatientHeaderObj['RegId'] = contact.RegId;
    this.advanceDataStored.storage = new AdvanceDetailObj(PatientHeaderObj);

console.log(PatientHeaderObj)


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
              this.getWhatsappshareIPPaymentRec(response,this.vMobileNo)
            }
          });
        } else {
          Swal.fire('Error !', 'IP Billing Payment not saved', 'error');
        }

      });
    });

  }

// onwhatsappbill() {
  getWhatsappshareIPFinalBill(el, vmono) {
    debugger
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPBill',
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
        this.toastr.success('IP Final Bill Receipt Sent on WhatsApp Successfully.', 'Save !', {
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
  getWhatsappshareIPPaymentRec(el, vmono) {
    debugger
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPRECEIPT',
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
        this.toastr.success('IP Payment Receipt Sent on WhatsApp Successfully.', 'Save !', {
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

  getWhatsappshareIPrefundBill(el, vmono) {
    debugger
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPREFBILL',
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
        this.toastr.success('IP Refund Of Bill Receipt Sent on WhatsApp Successfully.', 'Save !', {
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
  onClearbill() {

    this._IpBillBrowseListService.myFilterIpbillbrowseform.get('FirstName').reset();
    this._IpBillBrowseListService.myFilterIpbillbrowseform.get('LastName').reset();
    this._IpBillBrowseListService.myFilterIpbillbrowseform.get('RegNo').reset();
    this._IpBillBrowseListService.myFilterIpbillbrowseform.get('PBillNo').reset();
    this._IpBillBrowseListService.myFilterIpbillbrowseform.get('CompanyId').reset();
  }

  
  onClearpayment() {

    this._IpBillBrowseListService.myFilterIppaymentbrowseform.get('FirstName').reset();
    this._IpBillBrowseListService.myFilterIppaymentbrowseform.get('LastName').reset();
    this._IpBillBrowseListService.myFilterIppaymentbrowseform.get('RegNo').reset();
    this._IpBillBrowseListService.myFilterIppaymentbrowseform.get('PBillNo').reset();
    this._IpBillBrowseListService.myFilterIppaymentbrowseform.get('CompanyId').reset();
  }

  
  onClearrefund() {

    this._IpBillBrowseListService.myFilterIprefundbrowseform.get('FirstName').reset();
    this._IpBillBrowseListService.myFilterIprefundbrowseform.get('LastName').reset();
    this._IpBillBrowseListService.myFilterIprefundbrowseform.get('RegNo').reset();
    this._IpBillBrowseListService.myFilterIprefundbrowseform.get('PBillNo').reset();
    this._IpBillBrowseListService.myFilterIprefundbrowseform.get('CompanyId').reset();
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
    debugger
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._IpBillBrowseListService.myFilterIpbillbrowseform.get("FirstName").value + '%' || "%",
      "L_Name": this._IpBillBrowseListService.myFilterIpbillbrowseform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterIpbillbrowseform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt ": this.datePipe.transform(this._IpBillBrowseListService.myFilterIpbillbrowseform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._IpBillBrowseListService.myFilterIpbillbrowseform.get("RegNo").value || 0,
      "PBillNo": this._IpBillBrowseListService.myFilterIpbillbrowseform.get("PBillNo").value + '%' || "%",
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

  getFinalDisc(contact){
    console.log(contact);
    const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
      {
        maxWidth: "100%",
        height: '76%',
        width: '60%',
        data: contact
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.onShow_IpdBrowse();
    });
  } 
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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
    debugger
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



  viewgetBillReportclasswisePdf(row) {
    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._IpBillBrowseListService.getIpFinalBillclasswiseReceipt(
        row.BillNo
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Bill Class wise Viewer"
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
    let exportHeaders = ['BillDate', 'PBillNo', 'RegNo', 'PatientName', 'Age', 'MobileNo', 'DOA', 'DOD', 'IPDNo', 'DoctorName','RefDoctorName', 'TariffName', 'CompanyName', 'UnitName', 'TotalAmt', 'ConcessionAmt','NetPayableAmt',
        'BalanceAmt', 'CashPay', 'CardPay', 'ChequePay', 'OnlinePay','AdvUsedPay', 'PayCount', 'RefundAmount','CashCounterName','UserName'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Ip Bill Datewise');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }
  exportBillDatewiseReportPdf() {
    let actualData = [];
    this.dataSource.data.forEach(e => {
      var tempObj = [];
      
      tempObj.push(e.BillDate);
      tempObj.push(e.PBillNo);
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.MobileNo);
      tempObj.push(e.DOA);
      tempObj.push(e.DOD);
      tempObj.push(e.IPDNo);
      tempObj.push(e.DoctorName);
      tempObj.push(e.RefDoctorName);
      tempObj.push(e.TariffName);
      tempObj.push(e.CompanyName);
      tempObj.push(e.UnitName);
      tempObj.push(e.TotalAmt);
      tempObj.push(e.ConcessionAmt);
      tempObj.push(e.NetPayableAmt);
      tempObj.push(e.BalanceAmt);
      tempObj.push(e.CashPay);
      tempObj.push(e.CardPay);
      tempObj.push(e.ChequePay);
      tempObj.push(e.OnlinePay);
      tempObj.push(e.AdvUsedPay);
      tempObj.push(e.PayCount);
      tempObj.push(e.RefundAmount);
      tempObj.push(e.CashCounterName);
      tempObj.push(e.UserName);
    
      actualData.push(tempObj);
    });
    let headers = [ ['BillDate', 'PBillNo', 'RegNo', 'PatientName', 'Age', 'MobileNo', 'DOA', 'DOD', 'IPDNo', 'DoctorName','RefDoctorName', 'TariffName', 'CompanyName', 'UnitName', 'TotalAmt', 'ConcessionAmt','NetPayableAmt','BalanceAmt', 'CashPay', 'CardPay', 'ChequePay', 'OnlinePay','AdvUsedPay', 'PayCount', 'RefundAmount','CashCounterName','UserName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Bill');
  }
  

  exportReportPdf() {
    let actualData = [];
    this.dataSource2.data.forEach(e => {
      var tempObj = [];
      
      tempObj.push(e.RegNo);
      
      tempObj.push(e.PBillNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.TotalAmt);
      tempObj.push(e.BalanceAmt);
      tempObj.push(e.NetPayableAmt);
      tempObj.push(e.BalanceAmt);
      tempObj.push(e.AdvanceUsedAmount);
      tempObj.push(e.PaidAmount);
      tempObj.push(e.CashPayAmount);
      tempObj.push(e.ChequePayAmount);
      tempObj.push(e.CardPayAmount);
      tempObj.push(e.NEFTPayAmount);
      tempObj.push(e.PayTMAmount);
     
      actualData.push(tempObj);
    });
    let headers = [['RegNo','PBill No', 'Patient Name', 'Total Amt', 'Bal Amt', 'Net Payable Amt',,'AdvanceUsedAmount','PaidAmount', 'Cash Pay','Cheque Pay','Card Pay','NEFT Pay','PAYTm Pay']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Refund Of Bill');
  }
  
  getBrowseIPDPaymentReceiptList() {
    debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("FirstName").value + '%' || "%",
      "L_Name": this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("start").value, "MM-dd-yyyy"), //"01/01/2018",
      "To_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("end").value, "MM-dd-yyyy"), //"01/01/2020",
      "Reg_No": this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("RegNo").value || 0,
      "PBillNo": this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("PBillNo").value  || '%',
      "ReceiptNo": this._IpBillBrowseListService.myFilterIppaymentbrowseform.get("ReceiptNo").value || '%',
  
    }
    console.log(D_data);
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._IpBillBrowseListService.getIpdRefundpaymentreceiptBrowseList(D_data).subscribe(Visit => {
        this.dataSource2.data = Visit as BrowseIpdPaymentReceipt[];
        this.dataSource2.sort = this.sort;
        this.dataSource2.paginator = this.paginator;
        this.sIsLoading = '';
        this.click = false;
  
      },
        error => {
          this.sIsLoading = '';
        });
    },5);
  
  }
  
  
  getIpPaymentReceiptview(row) {
    this.chkprint=true;
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
    //  this.AdList=true;
    this._IpBillBrowseListService.getIpPaymentReceiptView(
    row.PaymentId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Payment Receipt Viewer"
          }
        });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          // this.SpinLoading = false;
          this.sIsLoading = '';
        });
    });
   
    },100);
  
    this.chkprint=false;
  }

  
  exportPaymentReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo', 'PatientName', 'PBillNo', 'TotalAmt', 'BalanceAmt', 'PaymentDate', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'AdvanceUsedAmount','PaidAmount', 
      'NEFTPayAmount', 'PayTMAmount', 'Remark', 'UserName'];
    this.reportDownloadService.getExportJsonData(this.dataSource2.data, exportHeaders, 'Ip Payment Datewise');
    this.dataSource2.data = [];
    this.sIsLoading = '';
  }
  exportPaymentReportPdf() {
    let actualData = [];
    this.dataSource2.data.forEach(e => {
      var tempObj = [];
      
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.PBillNo);
      tempObj.push(e.TotalAmt);
      tempObj.push(e.BalanceAmt);
      tempObj.push(e.PaymentDate);
      tempObj.push(e.CashPayAmount);
      tempObj.push(e.ChequePayAmount);
      tempObj.push(e.CardPayAmount);
      tempObj.push(e.AdvanceUsedAmount);
      tempObj.push(e.PaidAmount);
      tempObj.push(e.NEFTPayAmount);
      tempObj.push(e.PayTMAmount);
      tempObj.push(e.Remark);
      tempObj.push(e.UserName);
    actualData.push(tempObj);
    });
    let headers = [['RegNo', 'PatientName', 'PBillNo', 'TotalAmt', 'BalanceAmt', 'PaymentDate', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'AdvanceUsedAmount','PaidAmount', 
      'NEFTPayAmount', 'PayTMAmount', 'Remark', 'UserName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Payment');
  }


  //Refund
  
  getBrowseIPDRefundbillList(){
    debugger
    this.sIsLoading = 'loading-data';
    var D_data= {
      "F_Name":this._IpBillBrowseListService.myFilterIprefundbrowseform.get("FirstName").value + '%' || "%",
      "L_Name":this._IpBillBrowseListService.myFilterIprefundbrowseform.get("LastName").value + '%' || "%",
      "From_Dt" : this.datePipe.transform(this._IpBillBrowseListService.myFilterIprefundbrowseform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
      "To_Dt" : this.datePipe.transform(this._IpBillBrowseListService.myFilterIprefundbrowseform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
      "Reg_No":this._IpBillBrowseListService.myFilterIprefundbrowseform.get("RegNo").value || 0,
      // "PBillNo":this._IPBrowseRefundofBillService.myFilterform.get("PBillNo").value || "0",
    }
  
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(D_data);
        this._IpBillBrowseListService.getIpdRefundBillBrowseList(D_data).subscribe(Visit=> {
        this.dataSource3.data = Visit as RefundMaster[];
        console.log(this.dataSource.data);
        this.dataSource3.sort= this.sort;
        this.dataSource3.paginator=this.paginator;
        this.sIsLoading = ' ';
        this.click = false;
        
      },
        error => {
          this.sIsLoading = '';
        });
    }, 50);
  
  }
  
  
  
  
  viewgetRefundofbillReportPdf(row) {
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._IpBillBrowseListService.getRefundofbillview(
      row.RefundId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Refund Of Bill Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }
  exportIprefundofbillReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo', 'RefundDate', 'PatientName', 'RefundAmount', 'TotalAmt', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'Remark'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Ip Refund Of Bill Datewise');
    this.dataSource.data = [];
    this.sIsLoading = '';
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
  MobileNo: any;
  DOA: any;
  DOD: any;
  RefDoctorName: any;
  TariffName: any;
  CompanyName: any;
  UnitName: any;

  BalanceAmt: any;
  CashPay: any;
  CardPay: any;
  ChequePay: any;
  OnlinePay: any;
  AdvUsedPay: any;
  PayCount: any;
  RefundAmount: any;
  // 'RefundCount',
  CashCounterName: any;
  

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


      this. MobileNo = IpBillBrowseList. MobileNo || '';
      this.DOA = IpBillBrowseList.DOA || '';
      this.DOD = IpBillBrowseList.DOD || '';
      this.RefDoctorName = IpBillBrowseList.RefDoctorName || '';
      this.TariffName = IpBillBrowseList.TariffName || '';
      this.CompanyName = IpBillBrowseList.CompanyName || '';
      this.BalanceAmt = IpBillBrowseList.BalanceAmt || '';
      this.CashPay = IpBillBrowseList.CashPay || '';
      this.CardPay = IpBillBrowseList.CardPay || '';
      this.ChequePay = IpBillBrowseList.ChequePay || 0;
      this.OnlinePay = IpBillBrowseList.OnlinePay || 0;
      this.AdvUsedPay = IpBillBrowseList.AdvUsedPay || 0;
      this.PayCount = IpBillBrowseList.PayCount || ';'
      this.RefundAmount = IpBillBrowseList.RefundAmount || '';
      this.CashCounterName = IpBillBrowseList.CashCounterName || '';
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

