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
// import { PrintServiceService } from 'app/core/services/print-service.service';
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
  Groupname:any;
  SpinLoading:boolean=false;
  AdList:boolean=false;


  displayedColumns = [

    'SelfOrCompany',
    'InterimOrFinal',
    'BalanceAmt',
    'BillDate',
    'PBillNo',
    'RegID',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'CashPay',
    'CardPay',
    'ChequePay',
    'NEFTPay',
    'PayTMPay',
    'AdvPay',
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
    //  this.getPrint(contact);
    if(contact.InterimOrFinal)
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

  SubMenu(contact) {}

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
    debugger
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


      let iPsettlementAdvanceDetailUpdateobj= {};
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


      debugger
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
        "iPsettlementAdvanceDetailUpdate":iPsettlementAdvanceDetailUpdate,
        "iPsettlementAdvanceHeaderUpdate":iPsettlementAdvanceHeaderUpdate
      };

      console.log(Data)
      this._IpBillBrowseListService.InsertIPCreditBillingPayment(Data).subscribe(response => {
        if (response) {
          Swal.fire('IP Bill With Settlement!', 'Bill Payment Successfully !', 'success').then((result) => {
            if (result) {
              // let m = response;
              // this.getPrint(response);
              this.viewgetBillReportPdf(response)
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
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



  onShow_IpdBrowse() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._IpBillBrowseListService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._IpBillBrowseListService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._IpBillBrowseListService.myFilterform.get("RegNo").value || 0,
      "PBillNo": this._IpBillBrowseListService.myFilterform.get("PBillNo").value || 0,
      "IsInterimOrFinal": 2,//this._ipbillBrowseService.myFilterform.get("IsInterimOrFinal").value || "0",
      "CompanyId": this._IpBillBrowseListService.myFilterform.get("CompanyId").value || 0,
    }
    console.log(D_data);
    this._IpBillBrowseListService.getIpBillBrowseList(D_data).subscribe(data => {
      this.dataSource.data = data as IpBillBrowseList[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
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
  ///// REPORT  TEMPOATE
  getFinalBillTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=3';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'EmailId', 'Phone', 'RegId', 'GroupName', 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'Doctorname', 'RefDocName', 'RoomName', 'BedName', 'RegNo',
        'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'ConcessionAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      let onlyGrpName = [];
      this.reportPrintObjList.forEach(ele => onlyGrpName.push(ele.GroupName));
      
      let grpNamesArr = [...new Set(onlyGrpName)];
      grpNamesArr.forEach(ele => this.dummyGrpNameArr.push({groupName: ele, isHidden: false}));

      this.groupWiseObj = this.reportPrintObjList.reduce((acc, item: any) => {
        if (!acc[item.GroupName]) {
          acc[item.GroupName] = [];
        }
        acc[item.GroupName].push(item);
        return acc;
      }, {})
      console.log(this.groupWiseObj);

      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];

        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';
        var strabc = this.getGroupName(objreportPrint.GroupName) + `
   <div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div>
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> 
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> 
    </div>
    <div style="display:flex;width:70px;justify-content: right;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> 
    </div>
    <div style="display:flex;width:70px;margin-left:10px;justify-content: center;">
        <div>`+ objreportPrint.Qty + `</div> 
    </div>
    <div style="display:flex;width:110px;justify-content: right;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> 
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      console.log(objPrintWordInfo);
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDates', this.transform2(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrDichargeDate', this.transform2(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrServiceDate', this.transform2(objPrintWordInfo.AdmissionTime));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrGroup', (objPrintWordInfo.GroupName));

      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      // console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      this.isShow = true;
      setTimeout(() => {
        // this.print();
        this.printfinalbill();
      }, 1000);
    });
  }

  getGroupName(groupName: String) {
    let groupDiv;
    for(let i = 0; i < this.dummyGrpNameArr.length; i++) {
      if(this.dummyGrpNameArr[i].groupName == groupName && !this.dummyGrpNameArr[i].isHidden) {
        let groupHeader = `<div style="display:flex;width:960px;margin-left:20px;justify-content:space-between;">
          <div> <h3>`+ groupName + `</h3></div>
          <div> <h3>`+ this.getGroupTotalAmount(groupName) + `</h3></div>
        </div>`;
        this.dummyGrpNameArr[i].isHidden = true;
        groupDiv = groupHeader;
        break;
      } else {
        groupDiv = ``;
      }
    }
    return groupDiv;
  }

  getGroupTotalAmount(groupName: any) {
    let totalGrpAmt = 0;
    if(this.groupWiseObj[groupName]) {
      let groupArr = this.groupWiseObj[groupName];
      groupArr.forEach(element => {
        totalGrpAmt = totalGrpAmt + element.ChargesTotalAmt;
      });
    }
    return '₹ ' + totalGrpAmt.toFixed(2);
  }


  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }


  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy');
    return value;
  }

  convertToWord(e) {
    
    return converter.toWords(e);
  }

  viewgetBillReportPdf(BillNo) {
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
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
          this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

  viewgetBillReportDatewisePdf(row) {
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
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
          this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }


  viewgetBillReportwardwisePdf(row) {
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
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
          this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

  viewgetInterimBillReportPdf(BillNo) {
    setTimeout(() => {
      this.SpinLoading =true;
     this.AdList=true;
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
          this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }
  

  // GET DATA FROM DATABASE 
  getPrint(el) {

    if (el.InterimOrFinal == 1) {
      var D_data = {
        "BillNo": el.BillNo,
      }

      let printContents; 
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          console.log(res);
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          console.log(this.reportPrintObj);
          this.getFinalBillTemplate();
        
        })
      );
    }
    else {

      this.getIPIntreimBillPrint(el);
    
    }
  }
  isShow = false;
  printTemplate1: any


  // PRINT 
  print() {

    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
      <head><style type="text/css">`);
    popupWin.document.write(`
        </style>
            <title></title>
        </head>
      `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
      </html>`);
      if(this.reportPrintObjList.length > 0) {
        // console.log(this.reportPrintObjList.length)
        // if(this.reportPrintObjList[0].AdvanceUsedAmount === 0) {
        //   popupWin.document.getElementById('idUseAdvAmt').style.display = 'none';
        // }
      }
    popupWin.document.close();
  }

  printfinalbill(){
  
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
      <head><style type="text/css">`);
    popupWin.document.write(`
        </style>
            <title></title>
        </head>
      `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
      </html>`);
      if(this.reportPrintObjList.length > 0) {
      
        this.reportPrintObjList.forEach((element) => {
          debugger
         
         this.Groupname = element.GroupName;
         if(element.GenderName == this.Groupname)
         {
          console.log(this.Groupname )
          popupWin.document.getElementById('idgroup').style.display = 'none';
         }
        });

        // if(this.reportPrintObjList[0].AdvanceUsedAmount === 0) {
        //   popupWin.document.getElementById('idUseAdvAmt').style.display = 'none';
        // }
      }
    popupWin.document.close();
  }


  getSummaryFinalBillPrint(el) {
    debugger;
    if (el.InterimOrFinal == 0) {
      var D_data = {
        "BillNo": el.BillNo,
      }
    
      let printContents; 
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
        
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          this.getSummaryFinalBillTemplate();
         

        })
      );
    }
    else {

            this.getIPIntreimBillPrint(el);
    }
  }
  getSummaryFinalBillTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=18';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'EmailId', 'Phone', 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName', 'RoomName', 'BedName', 'ConcessionAmount',
        'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];
        // var strabc = ` <hr >
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:30px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:800px;margin-left:30px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:100px;margin-left:30px;align-text:right;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:30px;align-text:right;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;margin-left:30px;align-text:left;margin-right:50px">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDates', this.transform2(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrDichargeDate', this.transform2(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrServiceDate', this.transform2(objPrintWordInfo.AdmissionTime));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
     
      this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (objPrintWordInfo.BalanceAmt.toFixed(2)));

      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  //for Draft bill

  ///// REPORT  TEMPOATE
  getTemplateDraft() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=17';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'EmailId', 'Phone', 'RegId', 'GroupName', 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'Doctorname', 'RefDocName', 'RoomName', 'BedName', 'RegNo',
      'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'NetPayableAmt','TotalAmt', 'AdvanceUsedAmount', 'ConcessionAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];
        // var strabc = ` <hr >

        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;justify-content: right;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;justify-content: center;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:110px;justify-content: right;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord1(objPrintWordInfo.PaidAmount));
   
      this.printTemplate = this.printTemplate.replace('StrAdmissionDates', this.transform2(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrDichargeDate', this.transform2(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrServiceDate', this.transform2(objPrintWordInfo.AdmissionTime));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
     
      this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (objPrintWordInfo.BalanceAmt.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }


  getTemplateInterim() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=16';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'EmailId', 'Phone', 'RegId', 'GroupName', 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'Doctorname', 'RefDocName', 'RoomName', 'BedName', 'RegNo',
        'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount','NetPayableAmt', 'ConcessionAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];
        // var strabc = ` <hr >

        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;justify-content: right;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;justify-content: center;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:110px;justify-content: right;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord1(objPrintWordInfo.PaidAmount));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDates', this.transform2(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrDichargeDate', this.transform2(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrServiceDate', this.transform2(objPrintWordInfo.AdmissionTime));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrBalanceAmount', '₹' + (objPrintWordInfo.BalanceAmt.toFixed(2)));

      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  convertToWord1(e) {
  
    return converter.toWords(e);
  }

  // GET DATA FROM DATABASE 
  getIPIntreimBillPrint(el) {
    debugger;
    var D_data = {
      "BillNo": el.BillNo,
    }

    let printContents;
    this.subscriptionArr.push(
      this._IpBillBrowseListService.getIPIntriemBILLBrowsePrint(D_data).subscribe(res => {
        
        this.reportPrintObjList = res as ReportPrintObj[];
        this.reportPrintObj = res[0] as ReportPrintObj;
        
        this.getTemplateInterim();

      })
    );
  }

  
  getPrintWardWise(el) {
    debugger;
    if (el.InterimOrFinal == 1) {
      var D_data = {
        "BillNo": el.BillNo,
      }
      let printContents; 
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          console.log(res);
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          this.getFinalbillwardwiseTemplate();
         
        })
      );
    }
    else {

      this.getIPIntreimBillPrint(el);
    }
  }


  getPrintDatewise(el) {
    debugger;
    if (el.InterimOrFinal == 1) {
      var D_data = {
        "BillNo": el.BillNo,
      }
      let printContents; 
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsedatewisePrint(D_data).subscribe(res => {
          
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          this.getFinalbilldatewiseTemplate();
         
        })
      );
    }
    else {

      this.getIPIntreimBillPrint(el);
    }
  }

  getFinalbilldatewiseTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=34';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'EmailId', 'Phone', 'RegId', 'GroupName', 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'Doctorname', 'RefDocName', 'RoomName', 'BedName', 'RegNo',
      'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'ConcessionAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];

        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';
        var strabc = ` 
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.ChargesDate, 'dd/MM/yyyy') + `</div>
    </div>
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;align-text:left;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      console.log(objPrintWordInfo);
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDates', this.transform2(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrDichargeDate', this.transform2(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrServiceDate', this.transform2(objPrintWordInfo.AdmissionTime));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));

      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      this.isShow = true;
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }
  

  getFinalbillwardwiseTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=35';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'EmailId', 'Phone', 'RegId', 'GroupName', 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'Doctorname', 'RefDocName', 'RoomName', 'BedName', 'RegNo',
      'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'ConcessionAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];

        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';
        var strabc = ` 
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ 'Ward Name' + `</div>
    </div>
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;align-text:left;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      console.log(objPrintWordInfo);
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDates', this.transform2(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrDichargeDate', this.transform2(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrServiceDate', this.transform2(objPrintWordInfo.AdmissionTime));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
  
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      this.isShow = true;
      setTimeout(() => {
        this.print();
      }, 1000);
    });
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
  AdvanceNo:any;
  PaymentTime:any;
  BalanceAmount:any;
  UsedAmount:any;
  ChargesDate:any;
}

