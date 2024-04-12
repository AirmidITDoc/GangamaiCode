import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Subscription } from 'rxjs';
import { AdvanceDataStored } from '../../advance';
import { PaymentReceiptService } from '../payment-receipt.service';
import { DatePipe } from '@angular/common';
import { ViewBrowseIPDPaymentComponent } from '../view-browse-ipdpayment/view-browse-ipdpayment.component';
import * as converter from 'number-to-words';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';


@Component({
  selector: 'app-ipd-paymentreceipt',
  templateUrl: './ipd-paymentreceipt.component.html',
  styleUrls: ['./ipd-paymentreceipt.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IpdPaymentreceiptComponent implements OnInit {

  chkprint: boolean = false;
BrowseOpdPaymentReceiptList: any;
msg: any;
sIsLoading: string = '';
@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator;
@Input() dataArray: any;
click: boolean = false;
MouseEvent = true;



reportPrintObj: BrowseIpdPaymentReceipt;
subscriptionArr: Subscription[] = [];
printTemplate: any;
displayedColumns = [
  // 'checkbox',
  'RegNo',
  'PatientName',
  // 'PBillNo',
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
dataSource = new MatTableDataSource<BrowseIpdPaymentReceipt>();
hasSelectedContacts: boolean;


constructor(private _fuseSidebarService: FuseSidebarService,
  public _BrowseIPDPaymentReceiptService: PaymentReceiptService,
  public datePipe: DatePipe,
  private matDialog: MatDialog,
  private _matDialog: MatDialog,
  
  private advanceDataStored: AdvanceDataStored,) { }

ngOnInit(): void {
this.getBrowseIPDPaymentReceiptList();
}


onShow(event: MouseEvent) {
 
  this.click = !this.click;
  setTimeout(() => {
    {
      this.sIsLoading = 'loading-data';
      this.getBrowseIPDPaymentReceiptList();
    }
  }, 50);
  this.MouseEvent = true;
}

getRecord(el, i) {
  // console.log(el,i);
  // this.matDialog.open(SmsEmailTemplateComponent, {
  //   data: i,
  //   width: '40%',
  //   height: "fit-content",
  //   autoFocus: false
  // });

}


onClear() {

  this._BrowseIPDPaymentReceiptService.myFilterform.get('FirstName').reset();
  this._BrowseIPDPaymentReceiptService.myFilterform.get('LastName').reset();
  this._BrowseIPDPaymentReceiptService.myFilterform.get('RegNo').reset();
  this._BrowseIPDPaymentReceiptService.myFilterform.get('PBillNo').reset();
  this._BrowseIPDPaymentReceiptService.myFilterform.get('ReceiptNo').reset();
}

toggleSidebar(name): void {
  this._fuseSidebarService.getSidebar(name).toggleOpen();
}

ngOnChanges(changes: SimpleChanges) {
 
  this.dataSource.data = changes.dataArray.currentValue as BrowseIpdPaymentReceipt[];
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
}

getBrowseIPDPaymentReceiptList() {
  debugger;
  this.sIsLoading = 'loading-data';
  var D_data = {
    "F_Name": this._BrowseIPDPaymentReceiptService.myFilterform.get("FirstName").value + '%' || "%",
    "L_Name": this._BrowseIPDPaymentReceiptService.myFilterform.get("LastName").value + '%' || "%",
    "From_Dt": this.datePipe.transform(this._BrowseIPDPaymentReceiptService.myFilterform.get("start").value, "MM-dd-yyyy"), //"01/01/2018",
    "To_Dt": this.datePipe.transform(this._BrowseIPDPaymentReceiptService.myFilterform.get("end").value, "MM-dd-yyyy"), //"01/01/2020",
    "Reg_No": this._BrowseIPDPaymentReceiptService.myFilterform.get("RegNo").value || 0,
    "PBillNo": this._BrowseIPDPaymentReceiptService.myFilterform.get("PBillNo").value || 0,
    "ReceiptNo": this._BrowseIPDPaymentReceiptService.myFilterform.get("ReceiptNo").value || 0,

  }
  console.log(D_data);
  setTimeout(() => {
    this.sIsLoading = 'loading-data';
    this._BrowseIPDPaymentReceiptService.getIpdRefundpaymentreceiptBrowseList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as BrowseIpdPaymentReceipt[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;

    },
      error => {
        this.sIsLoading = '';
      });
  },5);

}

SpinLoading:boolean=false;
getIpPaymentReceiptview(row) {
  this.chkprint=true;
  setTimeout(() => {
    this.sIsLoading = 'loading-data';
  //  this.AdList=true;
  this._BrowseIPDPaymentReceiptService.getIpPaymentReceiptView(
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

getViewbill(contact)
{
   console.log(contact);
     let xx = {
      PaymentId:contact.PaymentId,
      BillNo: contact.BillNo,
      RegNo: contact.RegNo,
      RegId: contact.RegId,
      PatientName: contact.PatientName,
      FirstName:contact.FirstName,
      MiddleName: contact.MiddleName,
      LastName: contact.LastName,
      TotalAmt: contact.TotalAmt,
      BalanceAmt: contact.BalanceAmt,
      Remark: contact.Remark,
      PaymentDate: contact.PaymentDate,
      CashPayAmount :contact.CashPayAmount,
      ChequePayAmount : contact.ChequePayAmount,
      CardPayAmount : contact.CardPayAmount,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      AdvanceId:contact.AdvanceId,
      RefundId: contact.RefundId,
      IsCancelled: contact.IsCancelled,
      AddBy:contact.AddBy,
      UserName:contact.UserName,
      PBillNo: contact.PBillNo,
      ReceiptNo: contact.ReceiptNo,
      TransactionType:contact.TransactionType,
      PayDate:contact.PayDate,
      PaidAmount:contact.PaidAmount,
      NEFTPayAmount:contact.NEFTPayAmount,
      PayTMAmount: contact.PayTMAmount,
      BillDate:contact.BillDate,
      HospitalAddress:contact.HospitalAddress,
      HospitalName:contact.HospitalName,
      OPIPNo:contact.IPDNo

    };

     this.advanceDataStored.storage = new BrowseIpdPaymentReceipt(xx);
   
      const dialogRef = this.matDialog.open(ViewBrowseIPDPaymentComponent, 
       {  maxWidth: "75vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
       console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }




printpayment() {
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
  if(this.reportPrintObj.CashPayAmount === 0) {
    popupWin.document.getElementById('idCashpay').style.display = 'none';
  }
  if(this.reportPrintObj.CardPayAmount === 0) {
    popupWin.document.getElementById('idCardpay').style.display = 'none';
  }
  if(this.reportPrintObj.ChequePayAmount === 0) {
    popupWin.document.getElementById('idChequepay').style.display = 'none';
  }
  if(this.reportPrintObj.NEFTPayAmount === 0) {
    popupWin.document.getElementById('idNeftpay').style.display = 'none';
  }
  if(this.reportPrintObj.PayTMAmount === 0) {
    popupWin.document.getElementById('idPaytmpay').style.display = 'none';
  }
  if(this.reportPrintObj.ReferDr === "") {
    popupWin.document.getElementById('idrefdr').style.display = 'none';
  }
  if(this.reportPrintObj.Remark === "") {
    popupWin.document.getElementById('idremark').style.display = 'none';
  }
  popupWin.document.close();
}


printSettlement() {
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
  
    if(this.reportPrintObj.CashPayAmount === 0) {
      popupWin.document.getElementById('idCashpay').style.display = 'none';
    }
    if(this.reportPrintObj.CardPayAmount === 0) {
      popupWin.document.getElementById('idCardpay').style.display = 'none';
    }
    if(this.reportPrintObj.ChequePayAmount === 0) {
      popupWin.document.getElementById('idChequepay').style.display = 'none';
    }
    if(this.reportPrintObj.NEFTPayAmount === 0) {
      popupWin.document.getElementById('idNeftpay').style.display = 'none';
    }
    if(this.reportPrintObj.PayTMAmount === 0) {
      popupWin.document.getElementById('idPaytmpay').style.display = 'none';
    }
    if(this.reportPrintObj.ReferDr === "") {
      popupWin.document.getElementById('idrefdr').style.display = 'none';
    }

 
  popupWin.document.close();
}

getSettlementTemplate(){
  debugger
  let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=6';
this._BrowseIPDPaymentReceiptService.getTemplate(query).subscribe((resData: any) => {
  this.printTemplate = resData[0].TempDesign;
  let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','RegId','ConsultantDocName','ReferDr','ReceiptNo','PaymentDate','PatientName','AgeDay','AgeMonth','Age','PBillNo','PaidAmount','Remark','BillDate','PaymentId','TotalAmt','CashPayAmount','UserName'
,'CashPayAmount','CardPayAmount','ChequePayAmount','NEFTPayAmount','PayTMAmount','Remark','UserName','CardNo','CardBankName'];
    for (let i = 0; i < keysArray.length; i++) {
      let reString = "{{" + keysArray[i] + "}}";
      let re = new RegExp(reString, "g");
      this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
    }
    this.printTemplate = this.printTemplate.replace('StrTotalTotalAmtInWords', this.convertToWord(this.reportPrintObj.PaidAmount));
    this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(this.reportPrintObj.BillTime));
    this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(new Date().toString()));
    
    setTimeout(() => {
      this.printSettlement();
    }, 5);
});
}


getPaymentTemplate() {
let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=19';
this._BrowseIPDPaymentReceiptService.getTemplate(query).subscribe((resData: any) => {
  this.printTemplate = resData[0].TempDesign;
  let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','RegId','ConsultantDocName','ReferDr','ReceiptNo','PaymentDate','PatientName','AgeDay','AgeMonth','Age','PBillNo','NetPayableAmt','BalanceAmt','PaidAmount','Remark','BillDate','PaymentId','TotalAmt','CashPayAmount','UserName'
,'CashPayAmount','CardPayAmount','ChequePayAmount','NEFTPayAmount','PayTMAmount','Remark','UserName','CardNo','CardBankName'];
    for (let i = 0; i < keysArray.length; i++) {
      let reString = "{{" + keysArray[i] + "}}";
      let re = new RegExp(reString, "g");
      this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
    }
    this.printTemplate = this.printTemplate.replace('StrTotalTotalAmtInWords', this.convertToWord(this.reportPrintObj.PaidAmount));
    this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(this.reportPrintObj.BillTime));
    this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(new Date().toString()));
    setTimeout(() => {
      this.printpayment();
    }, 5);
});
}

convertToWord(e){

 return converter.toWords(e);
   }

transform1(value: string) {
var datePipe = new DatePipe("en-US");
 value = datePipe.transform(value, 'dd/MM/yyyy');
 return value;
}

transform2(value: string) {
var datePipe = new DatePipe("en-US");
value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
return value;
}



// 4457
getPrint(el) {
var D_data = {
"PaymentId":el.PaymentId,//206
}

let printContents; 
this.subscriptionArr.push(
this._BrowseIPDPaymentReceiptService.getBrowseIPDPaymentReceiptPrint(D_data).subscribe(res => {
  if(res){
  this.reportPrintObj = res[0] as BrowseIpdPaymentReceipt;
  
 }

 if(el.PatientTypeID !== 2){
  this.getSettlementTemplate();
  
 }else{
 
  this.getPaymentTemplate();
 }
})
);


}
}





export class BrowseIpdPaymentReceipt
{
  PaymentId: Number;
  BillNo: Number;
  RegNo: number;
  RegId: number;
  Age:any;
  PatientName: string;
  FirstName: string;
  MiddleName: string; 
  LastName: string;
  TotalAmt: number;
  BalanceAmt: number;
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
  BillDate:any;
  HospitalAddress:string;
  HospitalName:string;
  OPIPNo:any;
  PatientTypeID:any;
  ConsultantDocName:any;
  ReferDr:any;
  NetPayableAmt:any;
  BillTime:any;
      /**
   * Constructor
   *
   * @param BrowseIpdPaymentReceipt
   */
  constructor(BrowseIpdPaymentReceipt) {
      {
          this.PaymentId = BrowseIpdPaymentReceipt.PaymentId || '';
          this.BillNo = BrowseIpdPaymentReceipt.BillNo || '';
          this.RegNo = BrowseIpdPaymentReceipt.RegNo || '';
          this.RegId = BrowseIpdPaymentReceipt.RegId || '';
          this.PatientName = BrowseIpdPaymentReceipt.PatientName || '';
          this.Age = BrowseIpdPaymentReceipt.Age || '';
          this.FirstName = BrowseIpdPaymentReceipt.FirstName || '';
          this.MiddleName = BrowseIpdPaymentReceipt.MiddleName || '';
          this.LastName = BrowseIpdPaymentReceipt.LastName || '';
          this.TotalAmt = BrowseIpdPaymentReceipt.TotalAmt || '';
          this.BalanceAmt = BrowseIpdPaymentReceipt.BalanceAmt || '';
          this.Remark = BrowseIpdPaymentReceipt.Remark || '';
          this.PaymentDate = BrowseIpdPaymentReceipt.PaymentDate || '';
          this.CashPayAmount = BrowseIpdPaymentReceipt.CashPayAmount || '';
          this.ChequePayAmount = BrowseIpdPaymentReceipt.ChequePayAmount || '';
          this.CardPayAmount = BrowseIpdPaymentReceipt.CardPayAmount || '';
          this.AdvanceUsedAmount = BrowseIpdPaymentReceipt.AdvanceUsedAmount || '';
          this.AdvanceId = BrowseIpdPaymentReceipt.AdvanceId || '';
          this.RefundId = BrowseIpdPaymentReceipt.RefundId || '';
          this.IsCancelled = BrowseIpdPaymentReceipt.IsCancelled || '';
          this.AddBy = BrowseIpdPaymentReceipt.AddBy || '';
          this.UserName = BrowseIpdPaymentReceipt.UserName || '';
          this.ReceiptNo = BrowseIpdPaymentReceipt.ReceiptNo || '';
          this.PBillNo = BrowseIpdPaymentReceipt.PBillNo || '';
          this.TransactionType = BrowseIpdPaymentReceipt.TransactionType || '';
          this.PayDate = BrowseIpdPaymentReceipt.PayDate || '';
          this.PaidAmount = BrowseIpdPaymentReceipt.PaidAmount || '';
          this.NEFTPayAmount = BrowseIpdPaymentReceipt.NEFTPayAmount || '';
          this.PayTMAmount = BrowseIpdPaymentReceipt.PayTMAmount || '';
          this.BillDate= BrowseIpdPaymentReceipt.BillDate|| '';
          this.HospitalAddress= BrowseIpdPaymentReceipt.HospitalAddress|| '';
          this.HospitalName= BrowseIpdPaymentReceipt.HospitalName|| '';
          this.OPIPNo=BrowseIpdPaymentReceipt.OPIPNo || '';
          this.PatientTypeID=BrowseIpdPaymentReceipt.PatientTypeID || 0;
          this.ConsultantDocName=BrowseIpdPaymentReceipt.ConsultantDocName || '';
          this.ReferDr =BrowseIpdPaymentReceipt.ReferDr|| '';
          this.NetPayableAmt =BrowseIpdPaymentReceipt.NetPayableAmt|| '';
          this.BillTime =BrowseIpdPaymentReceipt.BillTime|| '';
      }

  }
}