import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Injector, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BrowseOPBillService } from './browse-opbill.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ViewOPBillComponent } from './view-opbill/view-opbill.component';
import { IpPaymentInsert, OPAdvancePaymentComponent, UpdateBill } from '../op-search-list/op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentNewComponent } from '../op-search-list/op-payment-new/op-payment-new.component';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { BrowseOpdPaymentReceipt } from '../browse-payment-list/browse-payment-list.component';
import { RefundMaster } from '../browse-refund-list/browse-refund-list.component';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-browse-opbill',
  templateUrl: './browse-opbill.component.html',
  styleUrls: ['./browse-opbill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseOPBillComponent implements OnInit {

  @Output() showClicked = new EventEmitter();
  click: boolean = false;
  MouseEvent = true;
  hasSelectedContacts: boolean;
  isLoadingStr: string = '';
  dataArray = {};
  dataSource = new MatTableDataSource<BrowseOPDBill>();
  reportPrintObj: BrowseOPDBill;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: BrowseOPDBill[] = [];
  currentDate = new Date();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedAdvanceObj: BrowseOPDBill;
  numberInWords!: string;
  value = 123;
  BrowseOPDBillsList: any;
  msg: any;
  SpinLoading: boolean = false;
  AdList: boolean = false;
  vMobileNo:any;
  menuActions: Array<string> = [];
  isLoading = true;
  sIsLoading: string = '';
  displayedColumns = [
    'useraction',
    'BillDate',
    'PBillNo',
    'RegNo',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmt',
    'BalanceAmt',
    'CashPay',
    'ChequePay',
    'CardPay',
    'AdvUsedPay',
    'OnlinePay',
    'PayCount',
    'RefundAmount',
    'CashCounterName',
    'PatientAge',
    'MobileNo',
    'VisitDate',
    'DoctorName',
    'RefDoctorName',
    'HospitalName',
    'PatientType',
    'TariffName',
    'CompanyName',
    'DepartmentName',
    'action'
  ];

//Payment list
displayedColumns1 = [
  'PaymentDate',
  'PBillNo',
  'ReceiptNo',
  'RegNo',
  'PatientName',
  'TotalAmt',
  'BalanceAmt',
  'PaidAmount',
  'CashPayAmount',
  'ChequePayAmount',
  'CardPayAmount',
  'AdvanceUsedAmount',
  'OnlinePay',
  'MobileNo',
  'VisitDate',
  'DoctorName',
  'RefDoctorName',
  'HospitalName',
  // 'PatientType',
  // 'TariffName',
  'CompanyName',
  // 'NEFTPayAmount',
  // 'PayTMAmount',
  'UserName',
  'buttons'
];
dataSource1 = new MatTableDataSource<BrowseOpdPaymentReceipt>();


displayedColumns2 = [
  'RefundDate',
  'RefundNo',
  'RegNo',
  'PatientName',
  'PaymentDate',
  'RefundAmount',
  'TotalAmt',
  'PBillNo',
  'MobileNo',
  'DoctorName',
  'RefDoctorName',
  'HospitalName',
  'PatientType',
  'TariffName',
  'CompanyName',
  'buttons'
];
dataSource2 = new MatTableDataSource<RefundMaster>();

  showSpinner = false;
  tablehide = false;
  tableshow = true;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDBillsService: BrowseOPBillService,
    public _PrintPreview: PrintPreviewService,
    public datePipe: DatePipe,
    private reportDownloadService: ExcelDownloadService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    public _WhatsAppEmailService:WhatsAppEmailService,
    public toastr: ToastrService,
    private _ActRoute: Router
  ) { }

  ngOnInit(): void {
    if (this._ActRoute.url == '/opd/browse-opd-bills') {
      this.menuActions.push('Print Final Bill');
      this.menuActions.push('Print FinalBill With Package Details'); 
    } 
 

    this.getBrowseOPDBillsList();
    this.getBrowseOpdPaymentReceiptList();
    this.getBrowseOPDReturnList();
    this.onClearBill();
    this.onClearpayment();
    this.onClearrefund();
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  openPaymentpopup(contact){
    console.log(contact)
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(contact.BillDate, 'MM/dd/yyyy') || '01/01/1900',
    PatientHeaderObj['RegNo'] = contact.RegNo;
    PatientHeaderObj['PatientName'] = contact.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
    PatientHeaderObj['Age'] = contact.PatientAge;
    PatientHeaderObj['DepartmentName'] = contact.DepartmentName;
    PatientHeaderObj['DoctorName'] = contact.DoctorName;
    PatientHeaderObj['TariffName'] = contact.TariffName;
    PatientHeaderObj['CompanyName'] = contact.CompanyName;
    PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
    this.vMobileNo = contact.MobileNo;
    
    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {

        maxWidth: "80vw",
       // height: '600px',
        width: '70%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "OP-Bill"
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if (result.IsSubmitFlag == true) {
          this.vpaidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
          this.vbalanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
          let updateBillobj = {};
          updateBillobj['BillNo'] = contact.BillNo;
          updateBillobj['BillBalAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController || result.submitDataPay.ipPaymentInsert.BalanceAmt;//result.BalAmt;
          const updateBill = new UpdateBill(updateBillobj);
          let Data = {
            "updateBill": updateBill,
            "paymentCreditUpdate": result.submitDataPay.ipPaymentInsert
          };
          console.log(Data)
          this._BrowseOPDBillsService.InsertOPBillingsettlement(Data).subscribe(response => {
            if (response) {
              Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  
                  this.viewgetOPPayemntPdf(response,true)
                  this._matDialog.closeAll();
                  this.getBrowseOPDBillsList();
                  this.getWhatsappshareOPPaymentReceipt(response,this.vMobileNo);
                }
              });
            }
            else {
              Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
            }
          });
        }
      });
  }
  
  vpaidamt: any = 0;
  vbalanceamt: any = 0;
  NewBillpayment(contact) {
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.datePipe.transform(contact.BillDate, 'MM/dd/yyyy') || '01/01/1900',
    PatientHeaderObj['PatientName'] = contact.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.VisitId;
    PatientHeaderObj['Doctorname'] = contact.DoctorName;
    PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
    PatientHeaderObj['BillId'] = contact.BillNo
    PatientHeaderObj['UHIDNO'] = contact.RegNo
    ;

    const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
      {
        maxWidth: "75vw",
        height: '600px',
        width: '75%',
        data: {
          vPatientHeaderObj: contact,
          FromName: "OP-Bill",
          advanceObj: PatientHeaderObj,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result.IsSubmitFlag == true) {
        this.vpaidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
        this.vbalanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
        let updateBillobj = {};
        updateBillobj['BillNo'] = contact.BillNo;
        updateBillobj['BillBalAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController || result.submitDataPay.ipPaymentInsert.BalanceAmt;//result.BalAmt;
        const updateBill = new UpdateBill(updateBillobj);
        let Data = {
          "updateBill": updateBill,
          "paymentCreditUpdate": result.submitDataPay.ipPaymentInsert
        };
        console.log(Data)
        this._BrowseOPDBillsService.InsertOPBillingsettlement(Data).subscribe(response => {
          if (response) {
            Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                
                this.viewgetOPPayemntPdf(response,true)
                this._matDialog.closeAll();
                this.getBrowseOPDBillsList();
                this.getWhatsappshareOPPaymentReceipt(response,this.vMobileNo);
              }
            });
          }
          else {
            Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
          }
        });
      }
    });

  }

  getWhatsappshareOPPaymentReceipt(el, vmono) {
    debugger
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'OPRECEIPT',
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
        this.toastr.success('OP Settlement Receipt Sent on WhatsApp Successfully.', 'Save !', {
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

  getWhatsappshareRefundbill(el, vmono) {
    debugger
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'OPREFBILL',
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
        this.toastr.success('Refund Of Bill Sent on WhatsApp Successfully.', 'Save !', {
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


  onShow(event: MouseEvent) {
    this.click = !this.click;
    setTimeout(() => {
      {
        this.isLoadingStr = 'loading-data';
        this.getBrowseOPDBillsList();
      }
    }, 1000);
    this.MouseEvent = true;
    this.click = true;

  }


  viewgetOPBillReportPdf(contact) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
      this.AdList = true;
      this._BrowseOPDBillsService.getOpBillReceipt(
        contact.BillNo
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP BILL Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }

  viewgetOPBillWithPackageReportPdf(contact) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
      this.AdList = true;
      this._BrowseOPDBillsService.getOpBillWithPackageReceipt(
        contact.BillNo
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "OP BILL Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }


  onClearBill() {
    this._BrowseOPDBillsService.myFilterbillform.get('FirstName').reset('');
    this._BrowseOPDBillsService.myFilterbillform.get('LastName').reset('');
    this._BrowseOPDBillsService.myFilterbillform.get('RegNo').reset('');
    this._BrowseOPDBillsService.myFilterbillform.get('PBillNo').reset('');
  }

  onClearpayment() {
    this._BrowseOPDBillsService.myFilterpayform.get('FirstName').reset('');
    this._BrowseOPDBillsService.myFilterpayform.get('LastName').reset('');
    this._BrowseOPDBillsService.myFilterpayform.get('RegNo').reset('');
    this._BrowseOPDBillsService.myFilterpayform.get('PBillNo').reset('');
  }

  onClearrefund() {
    this._BrowseOPDBillsService.myFilterrefundform.get('FirstName').reset('');
    this._BrowseOPDBillsService.myFilterrefundform.get('LastName').reset('');
    this._BrowseOPDBillsService.myFilterrefundform.get('RegNo').reset('');
    this._BrowseOPDBillsService.myFilterrefundform.get('PBillNo').reset('');
  }

  // sIsLoading: any = '';
  getWhatsappshareSales(Param) {
    debugger
    if(Param.MobileNo !='' && Param.MobileNo !=0 ){
    console.log(Param)
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": Param.MobileNo,
        "smsString": '',
        "isSent": 0,
        "smsType": 'OPBill',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": Param.BillNo,
        "PatientType": 0,//el.PatientType,
        "templateId": 0,
        "smSurl": '',
        "filePath": '',
        "smsOutGoingID": 0
      }
    }
    this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
      }

    });
  }
    // this.IsLoading = false;
    // el.button.disbled = false;
  }
  dsOPBrowseList = new MatTableDataSource<BrowseOPDBill>();
  resultsLength = 0;
  getBrowseOPDBillsList() {
    // this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": (this._BrowseOPDBillsService.myFilterbillform.get("FirstName").value).trim() + '%' || "%",
      "L_Name": (this._BrowseOPDBillsService.myFilterbillform.get("LastName").value).trim() + '%' || "%",
      "From_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterbillform.get("start").value, "MM-dd-yyyy"),
      "To_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterbillform.get("end").value, "MM-dd-yyyy"),
      "Reg_No": this._BrowseOPDBillsService.myFilterbillform.get("RegNo").value || 0,
      "PBillNo": this._BrowseOPDBillsService.myFilterbillform.get("PBillNo").value || "%",
      "Start":(this.paginator?.pageIndex??0),
      "Length":(this.paginator?.pageSize??35)
    }
      this._BrowseOPDBillsService.getBrowseOPDBillsList(D_data).subscribe(Visit => {
      this.dsOPBrowseList.data = Visit as BrowseOPDBill[];
      this.dsOPBrowseList.data = Visit["Table1"] ?? [] as BrowseOPDBill[];
      this.resultsLength= Visit["Table"][0]["total_row"];
      this.sIsLoading = this.dsOPBrowseList.data.length == 0 ? 'no-data' : '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }

  viewgetOPDDailycollectionReportPdf() {
    this.sIsLoading == 'loading-data'
    let start = this.datePipe.transform(this._BrowseOPDBillsService.myFilterbillform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let end = this.datePipe.transform(this._BrowseOPDBillsService.myFilterbillform.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._BrowseOPDBillsService.getDailycollectionview(
        start, end, 0
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Day Wise Stock Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });

      });

    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {

    this.dsOPBrowseList.data = changes.dataArray.currentValue as BrowseOPDBill[];
    this.dsOPBrowseList.sort = this.sort;
    this.dsOPBrowseList.paginator = this.paginator;
  }




  createCDKPortal(data, windowInstance) {
    if (windowInstance) {
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
      const injector = this.createInjector(data);
      let componentInstance;
      componentInstance = this.attachHeaderContainer(outlet, injector);
      let template = windowInstance.document.createElement('div'); // is a node
      template.innerHTML = this.printTemplate;
      windowInstance.document.body.appendChild(template);
    }
  }
  createInjector(data): any {
    const injectionTokens = new WeakMap();
    injectionTokens.set({}, data);
    return new PortalInjector(this.injector, injectionTokens);
  }

  attachHeaderContainer(outlet, injector) {
    const containerPortal = new ComponentPortal(HeaderComponent, null, injector);
    const containerRef: ComponentRef<HeaderComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }



  getViewbill(contact) {
    let xx = {
      RegNo: contact.RegId,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      HospitalAddress: contact.HospitalAddress,
      BDate: contact.BDate,
      BalanceAmt: contact.BalanceAmt,
      TotalAmt: contact.TotalAmt,
      BillDate: contact.BillDate,
      BillNo: contact.BillNo,
      ConcessionAmt: contact.ConcessionAmt,
      HospitalName: contact.HospitalName,
      NetPayableAmt: contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      VisitDate: contact.VisitDate,
      TotalBillAmount: contact.TotalBillAmount,
      TransactionType: contact.TransactionType,
      ConsultantDocName: contact.ConsultantDocName,
      DepartmentName: contact.DepartmentName,
      AddedByName: contact.AddedByName,
      NetAmount: contact.NetAmount,
      ServiceName: contact.ServiceName,
      Price: contact.Price,
      Qty: contact.Qty,



    };
    this.advanceDataStored.storage = new BrowseOPDBill(xx);
    const dialogRef = this._matDialog.open(ViewOPBillComponent,
      {
        maxWidth: "80vw",
        maxHeight: "100vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }



  getRecord(el, i) {
    // console.log(el,i);
    // this._matDialog.open(SmsEmailTemplateComponent, {
    //   data: i,
    //   width: '40%',
    //   height: "fit-content",
    //   autoFocus: false
    // });

  }


  exportOPBillReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BillDate', 'BillNo', 'RegNo', 'PatientName', 'TotalAmt', 'ConcessionAmt', 'NetPayableAmt', 'PaidAmount', 'BalanceAmt'];
    this.reportDownloadService.getExportJsonData(this.dsOPBrowseList.data, exportHeaders, 'OP BILL');
    this.dsOPBrowseList.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dsOPBrowseList.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.BillDate);
      tempObj.push(e.BillNo);
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.TotalAmt);
      tempObj.push(e.ConcessionAmt);
      tempObj.push(e.NetPayableAmt);
      tempObj.push(e.PaidAmount);
      tempObj.push(e.BalanceAmt);
      actualData.push(tempObj);
    });
    let headers = [['BillDate', 'BillNo', 'RegNo', 'PatientName', 'TotalAmt', 'ConcessionAmt', 'NetPayableAmt', 'PaidAmount','BalanceAmt']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'OP Bill');
  }


  exportoppaymentReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['PaymentDate', 'PBillNo', 'ReceiptNo', 'RegNo','PatientName', 'TotalAmt', 'BalanceAmt', 'PaidAmount', 'CashPayAmount', 'ChequePayAmount','CardPayAmount', 'NEFTPayAmount','PayTMAmount', 'AdvanceUsedAmount','UserName'];
    this.reportDownloadService.getExportJsonData(this.dataSource1.data, exportHeaders, 'OP Payment');
    this.dataSource1.data = [];
    this.sIsLoading = '';
  }

  exportoppaymentReportPdf() {
    let actualData = [];
    this.dataSource1.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.PaymentDate);
      tempObj.push(e.PBillNo);
      tempObj.push(e.ReceiptNo);
      tempObj.push(e.RegNo);
      tempObj.push(e.PatientName);
      tempObj.push(e.TotalAmt);
      tempObj.push(e.BalanceAmt);
      tempObj.push(e.PaidAmount);
      tempObj.push(e.CashPayAmount);
      tempObj.push(e.ChequePayAmount);
      tempObj.push(e.CardPayAmount);
      tempObj.push(e.NEFTPayAmount);
      tempObj.push(e.PayTMAmount);
      tempObj.push(e.AdvanceUsedAmount);
      tempObj.push(e.UserName);
      actualData.push(tempObj);
    });
    let headers = [['PaymentDate', 'PBillNo', 'ReceiptNo', 'RegNo','PatientName', 'TotalAmt', 'BalanceAmt', 'PaidAmount', 'CashPayAmount', 'ChequePayAmount','CardPayAmount', 'NEFTPayAmount','PayTMAmount', 'AdvanceUsedAmount','UserName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'OP Payment');
  }


  //payment

  getBrowseOpdPaymentReceiptList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseOPDBillsService.myFilterpayform.get("FirstName").value + '%' || "%",
      "L_Name": this._BrowseOPDBillsService.myFilterpayform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterpayform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterpayform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._BrowseOPDBillsService.myFilterpayform.get("RegNo").value || 0,
      "PBillNo": this._BrowseOPDBillsService.myFilterpayform.get("PBillNo").value || 0,
      "ReceiptNo": this._BrowseOPDBillsService.myFilterpayform.get("ReceiptNo").value || 0,
      Start: (this.paginator?.pageIndex ?? 0),
      Length: (this.paginator?.pageSize ?? 35),
    }
    console.log(D_data)
    this._BrowseOPDBillsService.getBrowseOpdPaymentReceiptList(D_data).subscribe(Visit => {
      this.dataSource1.data = Visit as BrowseOpdPaymentReceipt[];
      this.dataSource1.data = Visit["Table1"] ?? [] as BrowseOpdPaymentReceipt[];
      console.log(this.dataSource1.data)
      this.resultsLength = Visit["Table"][0]["total_row"];
      this.sIsLoading = this.dataSource1.data.length == 0 ? 'no-data' : '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  viewgetOPPayemntPdf(Id,value) {
    debugger
    let PaymentId=0;
if(value)
 PaymentId=Id
else
PaymentId=Id.PaymentId
    setTimeout(() => {

      this._BrowseOPDBillsService.getOpPaymentview(
        PaymentId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Op Payment Receipt Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = '';
        });

      });

    }, 100);
  }
  
  exportoprefundReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RefundDate', 'RefundNo', 'RegNo','PatientName', 'MobileNo', 'PatientType', 'TariffName', 'CompanyName', 'PaymentDate','RefundAmount', 'TotalAmt','PBillNo'];
    this.reportDownloadService.getExportJsonData(this.dataSource2.data, exportHeaders, 'OP Refund Of Bill');
    this.dataSource2.data = [];
    this.sIsLoading = '';
  }

  exportoprefundReportPdf() {
    let actualData = [];
    this.dataSource2.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.RefundDate);
      actualData.push(tempObj);
    });
    let headers = [['RefundDate', 'RefundNo', 'RegNo','PatientName', 'MobileNo', 'PatientType', 'TariffName', 'CompanyName', 'PaymentDate','RefundAmount', 'TotalAmt','PBillNo']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'OP Refund Of Bill');
  }

  //refund
  getBrowseOPDReturnList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseOPDBillsService.myFilterrefundform.get("FirstName").value + '%' || '%',
      "L_Name": this._BrowseOPDBillsService.myFilterrefundform.get("LastName").value + '%' || '%',
      "From_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterrefundform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterrefundform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._BrowseOPDBillsService.myFilterrefundform.get("RegNo").value || 0,
      Start: (this.paginator?.pageIndex ?? 0),
      Length: (this.paginator?.pageSize ?? 35),
    }
    console.log(D_data)
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(D_data);
      this._BrowseOPDBillsService.getBrowseOPDReturnReceiptList(D_data).subscribe(Visit => {
        this.dataSource2.data = Visit as RefundMaster[];
        this.dataSource2.data = Visit["Table1"] ?? [] as RefundMaster[];
        console.log(this.dataSource2.data)
        this.resultsLength = Visit["Table"][0]["total_row"];
        this.sIsLoading = this.dataSource2.data.length == 0 ? 'no-data' : '';

        // this.dataSource2.data = Visit as RefundMaster[];
        // console.log(this.dataSource2.data);
        // this.dataSource2.sort = this.sort;
        // this.dataSource2.paginator = this.paginator;
        // this.sIsLoading = '';
        // this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);

  }
  viewgetOPRefundofBillPdf(row) {
    // this.sIsLoading = 'loading-data';
    
    setTimeout(() => {
    this._BrowseOPDBillsService.getOpRefundview(
      row.RefundId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Op Refund Of Bill Receipt Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          // this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = '';
        });
    });
   
    },100);
  }

  getRecord1(contact, m): void {
    debugger
    if (m == "Print Final Bill"){
      this.viewgetOPBillReportPdf(contact) 
    } 
    else if(m == "Print FinalBill With Package Details"){
      this.viewgetOPBillWithPackageReportPdf(contact) 
  }

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
}

export class ReportPrintObj {
  AdvanceNo: any;
  Address: any;
  HospitalName: any;
  RegNo: any;
  PatientName: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
}



export class BrowseOPDBill {
  BillNo: Number;

  RegId: number;
  RegNo: number;
  PatientName: string;
  FirstName: string;
  Middlename: string;
  LastName: string;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  BillDate: any;
  IPDNo: number;
  ServiceName: String;
  Price: number;
  Qty: number;
  ChargesTotalAmount: number;
  NetAmount: number;
  PaidAmount: number;
  HospitalName: string;
  HospitalAddress: string;
  Phone: number;
  EmailId: any;
  ChargesDoctorName: string;
  TotalBillAmount: number;
  ConsultantDocName: string;
  DepartmentName: string;
  IsCancelled: boolean;
  OPD_IPD_Type: number;
  PBillNo: string;
  BDate: Date;
  VisitDate: Date;
  BalanceAmt: number;
  AddedByName: string;
  Department: any;
  Address: any;
  MobileNo: any;
  Lbl:any;
  DocName:any;
  //PayTMAmount:number;
  //NEFTPayAmount:number;
  /**
   * Constructor
   *
   * @param BrowseOPDBill
   */
  constructor(BrowseOPDBill) {
    {
      this.BillNo = BrowseOPDBill.BillNo || '';
      this.RegId = BrowseOPDBill.RegId || '';
      this.RegNo = BrowseOPDBill.RegNo || '';
      this.PatientName = BrowseOPDBill.PatientName || '';
      this.FirstName = BrowseOPDBill.FirstName || '';
      this.Middlename = BrowseOPDBill.MiddleName || '';
      this.LastName = BrowseOPDBill.LastName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';
      this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
      this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
      this.BillDate = BrowseOPDBill.BillDate || '';
      this.IPDNo = BrowseOPDBill.IPDNo || '';
      this.IsCancelled = BrowseOPDBill.IsCancelled || '';
      this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
      this.PBillNo = BrowseOPDBill.PBillNo || '';
      this.BDate = BrowseOPDBill.BDate || '';
      this.PaidAmount = BrowseOPDBill.PaidAmount || '';
      this.BalanceAmt = BrowseOPDBill.BalanceAmt || '';
      this.ServiceName = BrowseOPDBill.ServiceName || '';
      this.Price = BrowseOPDBill.Price || '';
      this.Qty = BrowseOPDBill.Qty || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.NetAmount = BrowseOPDBill.NetAmount || '';
      this.HospitalName = BrowseOPDBill.HospitalName || '';
      this.HospitalAddress = BrowseOPDBill.HospitalAddress || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.Phone = BrowseOPDBill.Phone || '';
      this.EmailId = BrowseOPDBill.EmailId || '';
      this.ConsultantDocName = BrowseOPDBill.ConsultantDocName || '';
      this.DepartmentName = BrowseOPDBill.DepartmentName || '';
      this.TotalBillAmount = BrowseOPDBill.TotalBillAmount || '';
      this.ChargesDoctorName = BrowseOPDBill.ChargesDoctorName || '';
      this.VisitDate = BrowseOPDBill.VisitDate || '';
      this.AddedByName = BrowseOPDBill.AddedByName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';

      this.Address = BrowseOPDBill.Address || '';
      this.Department = BrowseOPDBill.Department || '';
      this.MobileNo = BrowseOPDBill.MobileNo || '';
    }
  }

}
