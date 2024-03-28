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
import * as converter from 'number-to-words';
import { IpPaymentInsert, OPAdvancePaymentComponent, UpdateBill } from '../op-search-list/op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentNewComponent } from '../op-search-list/op-payment-new/op-payment-new.component';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';



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
  SpinLoading:boolean=false;
  AdList:boolean=false;


  isLoading = true;
  sIsLoading: string = '';
  displayedColumns = [

    'chkBalanceAmt',
    // "Bill",
    'BillDate',
    'BillNo',
    'RegNo',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'action'
  ];


  showSpinner = false;
  tablehide = false;
  tableshow = true;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDBillsService: BrowseOPBillService,
    public _PrintPreview:PrintPreviewService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef

  ) { }

  ngOnInit(): void {
    this.getBrowseOPDBillsList();
    this.onClear();
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  NewBillpayment(contact) {

    let PatientHeaderObj = {};

  PatientHeaderObj['Date'] = this.datePipe.transform(contact.BillDate, 'MM/dd/yyyy') || '01/01/1900',
  PatientHeaderObj['PatientName'] = contact.PatientName;
PatientHeaderObj['OPD_IPD_Id'] = contact.vOPIPId;
PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
PatientHeaderObj['BillId'] = contact.BillNo;

    const dialogRef = this._matDialog.open(OpPaymentNewComponent,
      {
        maxWidth: "100vw",
        height: '600px',
        width: '100%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "OP_SETTLEMENT"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result.IsSubmitFlag == true) {

      
            let updateBillobj = {};
            updateBillobj['BillNo'] = contact.BillNo;
            updateBillobj['BillBalAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController //result.BalAmt;

            const updateBill = new UpdateBill(updateBillobj);
            let CreditPaymentobj = {};
            CreditPaymentobj['paymentId'] = 0;
            CreditPaymentobj['BillNo'] = contact.BillNo;
            CreditPaymentobj['ReceiptNo'] = '';
            CreditPaymentobj['PaymentDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900';//this.currentDate || '01/01/1900';
            CreditPaymentobj['PaymentTime'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy HH:mm') || '01/01/1900';;
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
            CreditPaymentobj['TransactionType'] = result.submitDataPay.ipPaymentInsert.TransactionType || 0;
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
            // CreditPaymentobj['PaidAmt'] = result.submitDataPay.ipPaymentInsert.paidAmountController || '',//this.paymentForm.get('paidAmountController').value;
            // CreditPaymentobj['BalanceAmt'] = result.submitDataPay.ipPaymentInsert.balanceAmountController || '';//this.paymentForm.get('balanceAmountController').value;

            const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);

            let Data = {
              "updateBill": updateBill,
              "paymentCreditUpdate": ipPaymentInsert
            };
            console.log(Data)
            this._BrowseOPDBillsService.InsertOPBillingsettlement(Data).subscribe(response => {
              if (response) {
                Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
                  if (result.isConfirmed) {
                    
                    //Return true so ant print
                    this.viewgetOPPayemntPdf(response)
                    this._matDialog.closeAll();
                  }
                });
              }
              else {
                Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
              }

            });

          }
          // else {
          //   Swal.fire('Payment not Done.....');
          // }
        });
         
    }



    
viewgetOPPayemntPdf(PaymentId) {
  
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
 
  },100);
}


// Billpayment(contact){
//   debugger
//   let PatientHeaderObj = {};

//   PatientHeaderObj['Date'] = this.datePipe.transform(contact.BillDate, 'MM/dd/yyyy') || '01/01/1900',
//   PatientHeaderObj['PatientName'] = contact.PatientName;
// PatientHeaderObj['OPD_IPD_Id'] = contact.vOPIPId;
// PatientHeaderObj['NetPayAmount'] = contact.NetAmount;
// PatientHeaderObj['BillId'] = contact.BillNo;

//   const dialogRef = this._matDialog.open(OpPaymentNewComponent,
//     {
//       maxWidth: "90vw",
//       height: '640px',
//       width: '100%',
//       // data: {
//       //   vPatientHeaderObj: PatientHeaderObj,
//       //   FromName: "OP-Bill"
//       // }
//       data: {
//         vPatientHeaderObj: PatientHeaderObj,
//         FromName: "OP_SETTLEMENT"
//       }
//     });

//   dialogRef.afterClosed().subscribe(result => {

//     let updateBillobj = {};


//     updateBillobj['BillNo'] = contact.BillNo;
//     updateBillobj['BillBalAmount'] = result.submitDataPay.BalAmt || 0;

//     const updateBill = new UpdateBill(updateBillobj);

    
//     let CreditPaymentobj = {};
//     CreditPaymentobj['paymentId'] = 0;
//     CreditPaymentobj['BillNo'] = contact.BillNo;
//     CreditPaymentobj['ReceiptNo'] = '';
//     CreditPaymentobj['PaymentDate'] = this.currentDate || '01/01/1900';
//     CreditPaymentobj['PaymentTime'] = this.currentDate || '01/01/1900';
//     CreditPaymentobj['CashPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CashPayAmount) || 0;
//     CreditPaymentobj['ChequePayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.ChequePayAmount) || 0;
//     CreditPaymentobj['ChequeNo'] = result.submitDataPay.ipPaymentInsert.ChequeNo || '';
//     CreditPaymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName || '';
//     CreditPaymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate || '01/01/1900';
//     CreditPaymentobj['CardPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CardPayAmount) || 0;
//     CreditPaymentobj['CardNo'] = result.submitDataPay.ipPaymentInsert.CardNo || '';
//     CreditPaymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName || '';
//     CreditPaymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate || '01/01/1900';
//     CreditPaymentobj['AdvanceUsedAmount'] = 0;
//     CreditPaymentobj['AdvanceId'] = 0;
//     CreditPaymentobj['RefundId'] = 0;
//     CreditPaymentobj['TransactionType'] = 0;
//     CreditPaymentobj['Remark'] = result.submitDataPay.ipPaymentInsert.Remark || '';
//     CreditPaymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
//       CreditPaymentobj['IsCancelled'] = 0;
//     CreditPaymentobj['IsCancelledBy'] = 0;
//     CreditPaymentobj['IsCancelledDate'] = this.currentDate;
//     // CreditPaymentobj['CashCounterId'] = 0;
//     // CreditPaymentobj['IsSelfORCompany'] = 0;
//     // CreditPaymentobj['CompanyId'] = 0;
//     CreditPaymentobj['opD_IPD_Type'] = 0;
//     CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.neftPayAmount) || 0;
//     CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.neftNo || '';
//     CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.neftBankMaster || '';
//     CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.neftDate || '01/01/1900';
//     CreditPaymentobj['PayTMAmount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount || 0;
//     CreditPaymentobj['PayTMTranNo'] = result.submitDataPay.ipPaymentInsert.paytmTransNo || '';
//     CreditPaymentobj['PayTMDate'] = result.submitDataPay.ipPaymentInsert.PayTMDate || '01/01/1900'
//     // CreditPaymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
//     // CreditPaymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;

    
//     const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);

//     let Data = {
//       "updateBill": updateBill,
//       "paymentCreditUpdate": ipPaymentInsert
//     };


//     this._BrowseOPDBillsService.InsertOPBillingsettlement(Data).subscribe(response => {
//       if (response) {
//         Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
//           if (result.isConfirmed) {
//             // let m = response;
//             // this.getPrint(m);
//             this._matDialog.closeAll();
//           }
//         });
//       } else {
//         Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
//       }

//     });
//   });

// }
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
   this.AdList=true;
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
        this.AdList=false;
        this.sIsLoading = '';
      });
  });
 
  },100);
}


onClear() {
  this._BrowseOPDBillsService.myFilterform.get('FirstName').reset('');
  this._BrowseOPDBillsService.myFilterform.get('LastName').reset('');
  this._BrowseOPDBillsService.myFilterform.get('RegNo').reset('');
  this._BrowseOPDBillsService.myFilterform.get('PBillNo').reset('');
}



getBrowseOPDBillsList() {
  this.isLoadingStr = 'loading';
  var D_data = {
    "F_Name": (this._BrowseOPDBillsService.myFilterform.get("FirstName").value).trim() + '%' || "%",
    "L_Name": (this._BrowseOPDBillsService.myFilterform.get("LastName").value).trim() + '%' || "%",
    "From_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("start").value, "MM-dd-yyyy"),
    "To_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("end").value, "MM-dd-yyyy"),
    "Reg_No": this._BrowseOPDBillsService.myFilterform.get("RegNo").value || 0,
    "PBillNo": this._BrowseOPDBillsService.myFilterform.get("PBillNo").value || 0,
  }
  setTimeout(() => {
    this.isLoadingStr = 'loading';
    this._BrowseOPDBillsService.getBrowseOPDBillsList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as BrowseOPDBill[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    },
      error => {
        this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
      });
  }, 1000);

  // this.onClear();
}

viewgetOPDDailycollectionReportPdf(){
  this.sIsLoading == 'loading-data'
  let start =  this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  let end =  this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  setTimeout(() => {
    this.SpinLoading =true;
  //  this.AdList=true;
  this._BrowseOPDBillsService.getDailycollectionview(
    start,end,0
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
 
  },100);
}

ngOnChanges(changes: SimpleChanges) {

  this.dataSource.data = changes.dataArray.currentValue as BrowseOPDBill[];
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
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
