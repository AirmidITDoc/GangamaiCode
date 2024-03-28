import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input, OnInit, Pipe, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BrowsePaymentListService } from './browse-payment-list.service';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ViewOPBrowsePaymentListComponent } from './view-opbrowse-payment-list/view-opbrowse-payment-list.component';
import { PrintPaymentComponent } from './print-payment/print-payment.component';
import * as converter from 'number-to-words';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-browse-payment-list',
  templateUrl: './browse-payment-list.component.html',
  styleUrls: ['./browse-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowsePaymentListComponent implements OnInit {
  click : boolean = false;
  MouseEvent=true;
  msg:any;
  currentDate=new Date();
  reportPrintObj: BrowseOpdPaymentReceipt;
  reportPrintObj1:HospitalMaster;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  sIsLoading: string = '';
  TempKeys:any;
  data:any;

  @Input() dataArray: any; 
  hasSelectedContacts: boolean;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  displayedColumns = [
  
    'RegNo',
    'PatientName',
    // 'Remark',
    'PaymentDate',
    'PBillNo',
    'ReceiptNo',
    'PayDate',
    'UserName',
    'TotalAmt',
    'BalanceAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'PaidAmount',
    'NEFTPayAmount',
     'PayTMAmount',
     'buttons'
  ];
  dataSource = new MatTableDataSource<BrowseOpdPaymentReceipt>();

  constructor( private _fuseSidebarService: FuseSidebarService,
    public _BrowseOpdPaymentReceiptService:BrowsePaymentListService,
    public datePipe: DatePipe,
    private sanitizer:DomSanitizer,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef) { }

  ngOnInit(): void {
    this.getBrowseOpdPaymentReceiptList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}



onShow(event:MouseEvent)
  {   
     
    this.click=!this.click;
     setTimeout(() => {
       {
        this.sIsLoading = 'loading-data';
        this.getBrowseOpdPaymentReceiptList();
      }
    }, 10);
    this.MouseEvent=true;
  }
  
  
    
    onClear() {
    
      this._BrowseOpdPaymentReceiptService.myFilterform.get('FirstName').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('LastName').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('RegNo').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('PBillNo').reset();
      this._BrowseOpdPaymentReceiptService.myFilterform.get('ReceiptNo').reset();
    }


getBrowseOpdPaymentReceiptList(){
  this.sIsLoading = 'loading-data';
  var D_data= {
    "F_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("FirstName").value + '%' || "%",
    "L_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("LastName").value+ '%' || "%",
    "From_Dt" : this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
    "To_Dt" : this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
    "Reg_No":this._BrowseOpdPaymentReceiptService.myFilterform.get("RegNo").value || 0,
    "PBillNo":this._BrowseOpdPaymentReceiptService.myFilterform.get("PBillNo").value || 0,
    "ReceiptNo":this._BrowseOpdPaymentReceiptService.myFilterform.get("ReceiptNo").value || 0,

  }
   
  this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptList(D_data).subscribe(Visit=> {
      
      this.dataSource.data =Visit as BrowseOpdPaymentReceipt[];
      
      this.dataSource.sort =this.sort;
      this.dataSource.paginator=this.paginator;
      this.sIsLoading = '';
      this.click=false;
     
    },
    error => {
      this.sIsLoading = '';
    });
}

ngOnChanges(changes: SimpleChanges) {

  this.dataSource.data = changes.dataArray.currentValue as BrowseOpdPaymentReceipt[];
  this.dataSource.sort =this.sort;
  this.dataSource.paginator=this.paginator;
}



viewgetOPPayemntPdf(row) {
 
  setTimeout(() => {

  this._BrowseOpdPaymentReceiptService.getOpPaymentview(
    row.PaymentId
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


  getRecord(el,i) {
    // console.log(el,i);
    // this._matDialog.open(SmsEmailTemplateComponent, {
    //   data: i,
    //   width: '40%',
    //   height: "fit-content",
    //   autoFocus: false
    // });

  }
  

getViewbill(contact)
{
  
    let xx = {
      PaymentId:contact.PaymentId,
      HospitalName:contact.HospitalName,
      HospitalAddress:contact.HospitalAddress,
      BillNo:contact.BillNo,
      RegNo:contact.RegNo,
      RegId: contact.RegId,
      PatientName: contact.PatientName,
      FirstName: contact.FirstName,
      MiddleName: contact.MiddleName, 
      LastName:contact.LastName,
      TotalAmt:contact.TotalAmt,
      BalanceAmt: contact.BalanceAmt,
      Remark: contact.Remark,
      PaymentDate: contact.PaymentDate,
      CashPayAmount : contact.CashPayAmount,
      ChequePayAmount :contact.ChequePayAmount,
      CardPayAmount :contact.CardPayAmount,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      AdvanceId:contact.AdvanceId,
      RefundId: contact.RefundId,
      IsCancelled: contact.IsCancelled,
      AddBy: contact.AddBy,
      UserName:contact.UserName,
      PBillNo: contact.PBillNo,
      ReceiptNo: contact.ReceiptNo,
      TransactionType:contact.TransactionType,
      PayDate:contact.PayDate,
      PaidAmount: contact.PaidAmount,
      NEFTPayAmount:contact.NEFTPayAmount,
      PayTMAmount:contact.PayTMAmount,
   

     
    };

    this.advanceDataStored.storage = new BrowseOpdPaymentReceipt(xx);
   
      const dialogRef = this._matDialog.open(PrintPaymentComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%",
          data : {
            registerObj : xx,
          }
     });
     dialogRef.afterClosed().subscribe(result => {
      
     });
  }



}


export class HospitalMaster{
  HospitalName:any;
 HospitalAddress:any;
 Phone:any;
 EmailId:any;
}

export class ReportPrintObj {
  AdvanceNo: any;
  Address: any;
  BillDate:any;
  BillNo:any;
  ReceiptNo:any;
  HospitalName: any;
  RegNo: any;
  RegId:any;
  GenderName:any;
  PatientName: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
  ConsultantDr:any;
  ReferDr:any;
  Age:any;
  PaidAmount:any;
  CashPayAmount:any;
  CardPayAmount:any;
  ChequePayAmount:any;
  NEFTPayAmount:any;
  PayTMAmount:any;
  Remark:any;
  UserName:any;
  CardNo:any;
CardBankName:any;
  
}


export class BrowseOpdPaymentReceipt
{
    PaymentId: Number;
    BillNo: Number;
    BillDate:any;
    RegNo: number;
    RegId: number;
    Age:any;
    AgeDay:any;
    AgeMonth:any;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    Department:any;
    MobileNo:any;
    ConsultantDr:string;
    ReferDr:string;
    LastName: string;
    TotalAmt: number;
    BalanceAmt: number;
    GenderName:any;
    Remark: string;
    PaymentDate: any;
    CashPayAmount : number;
    ChequePayAmount : number;
    CardPayAmount : number;
    AdvanceUsedAmount: number;
    AdvanceId:number;
    RefundId: number;
    IsCancelled: boolean;
    AddBy: number;
    UserName:string;
    PBillNo: string;
    ReceiptNo: string;
    TransactionType:number;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    CardNo: any;
    CardBankName:any;
    ChequeNo:any;
    HospitalName:any;
    HospitalAddress:any;
    EmailId:any;
    Phone:any;
    /**
     * Constructor
     *
     * @param BrowseOpdPaymentReceipt
     */
    constructor(BrowseOpdPaymentReceipt) {
        {
            this.PaymentId = BrowseOpdPaymentReceipt.PaymentId || '';
            this.BillNo = BrowseOpdPaymentReceipt.BillNo || '';
            this.BillDate = BrowseOpdPaymentReceipt.BillDate || '';
            this.RegNo = BrowseOpdPaymentReceipt.RegNo || '';
            this.RegId = BrowseOpdPaymentReceipt.RegId || '';
            this.Age = BrowseOpdPaymentReceipt.Age || '';
            this.AgeDay = BrowseOpdPaymentReceipt.AgeDay || '';
            this.AgeMonth = BrowseOpdPaymentReceipt.AgeMonth || '';
            this.PatientName = BrowseOpdPaymentReceipt.PatientName || '';
            this.FirstName = BrowseOpdPaymentReceipt.FirstName || '';
            this.MiddleName = BrowseOpdPaymentReceipt.MiddleName || '';
            this.ConsultantDr = BrowseOpdPaymentReceipt.ConsultantDr || '';
            this.ReferDr = BrowseOpdPaymentReceipt.ReferDr || '';
            this.LastName = BrowseOpdPaymentReceipt.LastName || '';
            this.TotalAmt = BrowseOpdPaymentReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseOpdPaymentReceipt.BalanceAmt || '';
            this.GenderName = BrowseOpdPaymentReceipt.GenderName || '';
            this.Remark = BrowseOpdPaymentReceipt.Remark || '';
            this.PaymentDate = BrowseOpdPaymentReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseOpdPaymentReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseOpdPaymentReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseOpdPaymentReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseOpdPaymentReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseOpdPaymentReceipt.AdvanceId || '';
            this.RefundId = BrowseOpdPaymentReceipt.RefundId || '';
            this.IsCancelled = BrowseOpdPaymentReceipt.IsCancelled || '';
            this.AddBy = BrowseOpdPaymentReceipt.AddBy || '';
            this.Department=BrowseOpdPaymentReceipt.Department || '';
            this.UserName = BrowseOpdPaymentReceipt.UserName || '';
            this.ReceiptNo = BrowseOpdPaymentReceipt.ReceiptNo || '';
            this.PBillNo = BrowseOpdPaymentReceipt.PBillNo || '';
            this.TransactionType = BrowseOpdPaymentReceipt.TransactionType || '';
            this.PayDate = BrowseOpdPaymentReceipt.PayDate || '';
            this.PaidAmount = BrowseOpdPaymentReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseOpdPaymentReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseOpdPaymentReceipt.PayTMAmount || '';
            this.CardNo = BrowseOpdPaymentReceipt.CardNo || '';
            this.CardBankName = BrowseOpdPaymentReceipt.CardBankName || '';
            this.ChequeNo=BrowseOpdPaymentReceipt.ChequeNo || 0;
             this.MobileNo=BrowseOpdPaymentReceipt.MobileNo || '';
            this.HospitalName = BrowseOpdPaymentReceipt.HospitalName || '';
            this.HospitalAddress = BrowseOpdPaymentReceipt.HospitalAddress || '';
            this.EmailId = BrowseOpdPaymentReceipt.EmailId || '';
            this.Phone=BrowseOpdPaymentReceipt.Phone || 0;
        }

    }
}
