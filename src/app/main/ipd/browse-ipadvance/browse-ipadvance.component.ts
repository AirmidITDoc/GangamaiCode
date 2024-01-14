import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BrowseIPAdvanceService } from './browse-ipadvance.service';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ViewIPAdvanceComponent } from './view-ipadvance/view-ipadvance.component';
import { MatDialog } from '@angular/material/dialog';
import { AdvanceDataStored } from '../advance';
import * as converter from 'number-to-words';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
@Component({
  selector: 'app-browse-ipadvance',
  templateUrl: './browse-ipadvance.component.html',
  styleUrls: ['./browse-ipadvance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseIPAdvanceComponent implements OnInit {


  hasSelectedContacts: boolean;
  outputWords=''
  BrowseOPDBillsList:any;
  msg:any;
  sIsLoading:any;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  // @Input() dataArray: any; 

  displayedColumns = [
    'RegNo',
    'Date',
    'PatientName',
    'AdvanceNo',
    'AdvanceAmount',
    // 'AddedBy',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'UserName',
    'buttons'
  ];
  dataSource = new MatTableDataSource<IpdAdvanceBrowseModel>();
  dataArray = new MatTableDataSource<IpdAdvanceBrowseModel>();

  reportPrintObj: IpdAdvanceBrowseModel;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
 
  constructor(public _advanceService:BrowseIPAdvanceService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,) { }

  ngOnInit(): void {
   this.onShow_IpdAdvance();
  }

  ngOnChanges(changes: SimpleChanges) {
 
    this.dataSource.data = changes.dataArray.currentValue as IpdAdvanceBrowseModel[];
    this.dataSource.sort =this.sort;
    this.dataSource.paginator=this.paginator;
  }

  getTemplate() {
    let query = 'select tempId,TempDesign,JSON_QUERY(TempKeys) as TempKeys from Tg_Htl_Tmp where TempId=1';
    this._advanceService.getTemplate(query).subscribe((resData: any) => {
          this.printTemplate = resData[0].TempDesign;
     
       let keysArray = ['HospitalName','HospitalAddress','Phone','EmailId','AdvanceNo','RegNo','AdvanceNo','Date','PatientName','AgeDay','AgeMonth','Age','IPDNo','AdmissionDate','PatientType','AdvanceAmount','reason','Addedby','Remark',
       'CardNo','CardPayAmount','CardDate','CardBankName','BankName','ChequeNo','ChequePayAmount','ChequeDate','CashPayAmount','NEFTPayAmount','PayTMAmount','TariffName'];// resData[0].TempKeys;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }

        this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));

        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform1(new Date().toString()));
        this.printTemplate = this.printTemplate.replace('StrAddmissionDate', this.transform1(this.reportPrintObj.AdmissionDate));
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}


  onShow_IpdAdvance(){
    debugger
    var D_data= {
      "F_Name":this._advanceService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name":this._advanceService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt" : this.datePipe.transform(this._advanceService.myFilterform.get("start").value,"MM/dd/yyyy") || "01/01/1900",
      "To_Dt" : this.datePipe.transform(this._advanceService.myFilterform.get("end").value,"MM/dd/yyyy") || "01/01/1900",
      "Reg_No":this._advanceService.myFilterform.get("RegNo").value || 0,
      "PBillNo":this._advanceService.myFilterform.get("PBillNo").value || 0
    }
   
    console.log(D_data);
    this._advanceService.getIpdAdvanceBrowseList(D_data).subscribe(Visit=> {
        this.dataArray.data = Visit as IpdAdvanceBrowseModel[];
        console.log(this.dataArray.data )
      });
  }

  onClear_IpdAdvance(){
    
  }

 
  convertToWord(e) {
    
    return converter.toWords(e);
  }

  
 
  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd/MM/yyyy ');
     return value;
 }

 transform1(value: string) {
  var datePipe = new DatePipe("en-US");
  value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
  return value;
}


  getPrint(el) {
  
    var D_data = {
      "AdvanceDetailID":el.AdvanceDetailID,
    }
    
    let printContents;
    this.subscriptionArr.push(
      this._advanceService.getAdvanceBrowsePrint(D_data).subscribe(res => {
        this.reportPrintObj = res[0] as IpdAdvanceBrowseModel;
        this.getTemplate();
     })
    );
  }

  print() {
    
    let popupWin, printContents;
   
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
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
    
    if(this.reportPrintObj.reason=== '') {
      popupWin.document.getElementById('idremark').style.display = 'none';
    }
    popupWin.document.close();
  }

  
viewgetIPAdvanceReportPdf(contact) {

  this._advanceService.getIPAdvanceReceipt(
 contact.AdvanceDetailID
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Pharma Sales Summary Viewer"
        }
      });
  });
}


  getViewAdvance(contact)
{
    let xx = {
      PaymentId:contact.PaymentId,
      HospitalName:contact.HospitalName,
      HospAddress:contact.HospitalAddress,
      Phone:contact.Phone,
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
      AdvanceDetailID:contact.AdvanceDetailID,
          
    };

    this.advanceDataStored.storage = new IpdAdvanceBrowseModel(xx);
   
      const dialogRef = this._matDialog.open(ViewIPAdvanceComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
     
     });
  }



  onClear(){}

}

export class IpdAdvanceBrowseModel {
  RegNo: Number;
  PatientName: string;
  Date: Date;
  AdvanceNo: string;
  TransactionID: number;
  AdvanceAmount: number;
  UsedAmount: number;
  BalanceAmount: number;
  AddedBy: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: number;
  TransactionType: number;
  UserName: string;
  RefundAmount:number;
  PrevAdvAmt:number;
  AdvanceId:number;
  IPDNo:any;
  AdvanceDetailID:number;
  HospitalName:any;
  HospAddress:any;
  Phone:any;
  EmailId:any;
  reason:any;

  Address: any;
  PatientType: any;
  TariffName:any;
  AdmissionDate:any;
  PayDate:Date;
  PaidAmount: number;
  NEFTPayAmount:number;
  PayTMAmount: number;
  CardNo: any;
  CardBankName:any;
  ChequeNo:any;
  PaymentDate: any;
  AdvanceUsedAmount: number;
    Remark:any;
    
  /**
* Constructor
*
* @param IpdAdvanceBrowseModel
*/
  constructor(IpdAdvanceBrowseModel) {
      {
          this.RegNo = IpdAdvanceBrowseModel.RegNo || '';
          this.PatientName = IpdAdvanceBrowseModel.PatientName || '';
          this.Date = IpdAdvanceBrowseModel.Date || '';
          this.AdvanceNo = IpdAdvanceBrowseModel.AdvanceNo || '';
          this.AdvanceAmount = IpdAdvanceBrowseModel.AdvanceAmount || '';
          this.UsedAmount = IpdAdvanceBrowseModel.UsedAmount || '';
          this.BalanceAmount = IpdAdvanceBrowseModel.BalanceAmount || '';
          this.AddedBy = IpdAdvanceBrowseModel.AddedBy || '';
          this.CashPayAmount = IpdAdvanceBrowseModel.CashPayAmount || '';
          this.ChequePayAmount = IpdAdvanceBrowseModel.ChequePayAmount || '';
          this.CardPayAmount = IpdAdvanceBrowseModel.CardPayAmount || '';
          this.UserName = IpdAdvanceBrowseModel.UserName || '';
          this.RefundAmount = IpdAdvanceBrowseModel.RefundAmount || '';
          this.PrevAdvAmt=IpdAdvanceBrowseModel.PrevAdvAmt || '';
          this.AdvanceId = IpdAdvanceBrowseModel.AdvanceId || 0;
          this.AdvanceDetailID = IpdAdvanceBrowseModel.AdvanceDetailID || 0;
          this.IPDNo = IpdAdvanceBrowseModel.IPDNo || 0;

          this.HospitalName=IpdAdvanceBrowseModel.HospitalName || '';
          this.HospAddress = IpdAdvanceBrowseModel.HospAddress || '';
          this.Phone = IpdAdvanceBrowseModel.Phone || 0;
          this.EmailId = IpdAdvanceBrowseModel.EmailId || 0;
          this.reason = IpdAdvanceBrowseModel.reason || 0;

          this.Address=IpdAdvanceBrowseModel.Address || '';
          this.PatientType = IpdAdvanceBrowseModel.PatientType || '';
          this.TariffName = IpdAdvanceBrowseModel.TariffName || 0;
          this.PayDate = IpdAdvanceBrowseModel.PayDate || 0;
          this.PaidAmount = IpdAdvanceBrowseModel.PaidAmount || 0;
          
          this.NEFTPayAmount=IpdAdvanceBrowseModel.NEFTPayAmount || '';
          this.PayTMAmount = IpdAdvanceBrowseModel.PayTMAmount || '';
          this.CardNo = IpdAdvanceBrowseModel.CardNo || 0;
          this.CardBankName = IpdAdvanceBrowseModel.CardBankName || 0;
          this.ChequeNo = IpdAdvanceBrowseModel.ChequeNo || 0;
          this.PaymentDate = IpdAdvanceBrowseModel.PaymentDate || '';
          this.AdvanceUsedAmount = IpdAdvanceBrowseModel.AdvanceUsedAmount || 0;
          this.AdvanceUsedAmount = IpdAdvanceBrowseModel.AdvanceUsedAmount || 0;
          this.Remark = IpdAdvanceBrowseModel.Remark || 0;
      }
  }

}