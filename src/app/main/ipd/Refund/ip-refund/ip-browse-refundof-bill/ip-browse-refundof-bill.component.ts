import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { IPBrowseRefundofBillService } from './ip-browse-refundof-bill.service';
import { ViewIPReunfofBillComponent } from './view-ip-reunfof-bill/view-ip-reunfof-bill.component';
import * as converter from 'number-to-words';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
@Component({
  selector: 'app-ip-browse-refundof-bill',
  templateUrl: './ip-browse-refundof-bill.component.html',
  styleUrls: ['./ip-browse-refundof-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBrowseRefundofBillComponent implements OnInit {

  click : boolean = false;
  MouseEvent=true;
  BrowseIPDRefundBillsList:any;
  msg:any;
  sIsLoading: string = '';
  SpinLoading:boolean=false;

reportPrintObj: BrowseIpdreturnadvanceReceipt;
subscriptionArr: Subscription[] = [];
printTemplate: any;



  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  @Input() dataArray: any; 

    
  displayedColumns = [
    'RegNo',
    // 'RefundId',
    'RefundDate',
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
  dataSource = new MatTableDataSource<RefundMaster>();
  hasSelectedContacts: boolean;
  

  constructor( private _fuseSidebarService: FuseSidebarService,
     public _IPBrowseRefundofBillService:IPBrowseRefundofBillService,
     private matDialog: MatDialog,
     private reportDownloadService: ExcelDownloadService,
          private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getBrowseIPDRefundbillList(); 
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}

ngOnChanges(changes: SimpleChanges) {
  // changes.prop contains the old and the new value...
  // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
  this.dataSource.data = changes.dataArray.currentValue as RefundMaster[];
  this.dataSource.sort =this.sort;
  this.dataSource.paginator=this.paginator;
}



getBrowseIPDRefundbillList(){
  debugger
  this.sIsLoading = 'loading-data';
  var D_data= {
    "F_Name":this._IPBrowseRefundofBillService.myFilterform.get("FirstName").value + '%' || "%",
    "L_Name":this._IPBrowseRefundofBillService.myFilterform.get("LastName").value + '%' || "%",
    "From_Dt" : this.datePipe.transform(this._IPBrowseRefundofBillService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
    "To_Dt" : this.datePipe.transform(this._IPBrowseRefundofBillService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
    "Reg_No":this._IPBrowseRefundofBillService.myFilterform.get("RegNo").value || 0,
    // "PBillNo":this._IPBrowseRefundofBillService.myFilterform.get("PBillNo").value || "0",
  }

  setTimeout(() => {
    this.sIsLoading = 'loading-data';
    console.log(D_data);
      this._IPBrowseRefundofBillService.getIpdRefundBillBrowseList(D_data).subscribe(Visit=> {
      this.dataSource.data = Visit as RefundMaster[];
      console.log(this.dataSource.data);
      this.dataSource.sort= this.sort;
      this.dataSource.paginator=this.paginator;
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
  this._IPBrowseRefundofBillService.getRefundofbillview(
    row.RefundId
  ).subscribe(res => {
    const dialogRef = this.matDialog.open(PdfviewerComponent,
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



getViewbill(contact)
{
  console.log(contact);
    let xx = {
     PaymentId :contact.PaymentId,
    BillNo: contact.BillNo,
    BillId:contact.BillId,
    RegId: contact.RegId,
    RegNo: contact.RegNo,
    PatientName: contact.PatientName,
    FirstName: contact.FirstName,
    MiddleName: contact.MiddleName,
    GenderName:contact.GenderName,
    LastName: contact.LastName,
    TotalAmt:contact.TotalAmt,
    BalanceAmt:contact.BalanceAmt,
    Remark: contact.Remark,
    PaymentDate: contact.PaymentDate,
    CashPayAmount :contact.CashPayAmount,
    ChequePayAmount:contact.ChequePayAmount,
    CardPayAmount :contact.CardPayAmount,
    AdvanceUsedAmount: contact.AdvanceUsedAmount,
    AdvanceId: contact.AdvanceId,
    RefundId: contact.RefundId,
    IsCancelled: contact.IsCancelled,
    AddedBy: contact.AddedBy,
    UserName: contact.AddedBy,
    PBillNo: contact.PBillNo,
    ReceiptNo: contact.ReceiptNo,
    TransactionType:contact.TransactionType,
    PayDate:contact.PayDate,
    PaidAmount:contact.PaidAmount,
    NEFTPayAmount:contact.NEFTPayAmount,
    PayTMAmount:contact.PayTMAmount,
    RefundAmount:contact.RefundAmount,
    RefundNo:contact.RefundNo,
    RefundDate:contact.RefundDate,
    };

    this.advanceDataStored.storage = new BrowseIpdreturnadvanceReceipt(xx);
   
      const dialogRef = this.matDialog.open(ViewIPReunfofBillComponent, 
       {  maxWidth: "95vw",
          maxHeight: "130vh", width: '100%', height: "100%"
     });
     dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
     });
  }


onShow(event:MouseEvent)
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

getRecord(el,i) {
  // console.log(el,i);
  // this.matDialog.open(SmsEmailTemplateComponent, {
  //   data: i,
  //   width: '40%',
  //   height: "fit-content",
  //   autoFocus: false
  // });

}


exportIprefundofbillReportExcel(){
  this.sIsLoading == 'loading-data'
  let exportHeaders = ['RegNo', 'RefundDate', 'PatientName', 'RefundAmount', 'TotalAmt', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'Remark'];
  this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Ip Refund Of Bill Datewise');
  this.dataSource.data = [];
  this.sIsLoading = '';
}

exportReportPdf() {
  let actualData = [];
  this.dataSource.data.forEach(e => {
    var tempObj = [];
    tempObj.push(e.RegNo);
    tempObj.push(e.RefundDate);
    tempObj.push(e.PatientName);
    tempObj.push(e.RefundAmount);
    tempObj.push(e.TotalAmt);
    tempObj.push(e.CashPayAmount);
    tempObj.push(e.ChequePayAmount);
    tempObj.push(e.CardPayAmount);
    tempObj.push(e.Remark);
    actualData.push(tempObj);
  });
  let headers = [['RegNo', 'RefundDate', 'PatientName', 'RefundAmount', 'TotalAmt', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount','Remark']];
  this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Refund Of Bill');
}


  onClear() {
  
    this._IPBrowseRefundofBillService.myFilterform.get('FirstName').reset();
    this._IPBrowseRefundofBillService.myFilterform.get('LastName').reset();
    this._IPBrowseRefundofBillService.myFilterform.get('RegNo').reset();
 
  }



}

export class RefundMaster {
  RefundId: number;
  RefundDate: Date;
  BillId:number;
  RefundAmt: number;
  RefundAmount:number;
  PatientName: Date;
  GenderName:String;
  Total: number;
  PaymentId: number;
  PaymentDate: any;
  CashPayAmount:number;
  ChequePayAmount:number;
  CardPayAmount:number;
  PBillNo:number;
RegNo:any;
TotalAmt:any;
Remark:any;


  constructor(RefundMaster) {
    {
      this.RefundId = RefundMaster.RefundId || 0;
      this.RefundDate = RefundMaster.RefundDate || '';
      this.BillId = RefundMaster.BillId || '';
      this.RefundAmt = RefundMaster.RefundAmt || 0;
      this.RefundAmount=RefundMaster.RefundAmount || 0;
      this.PatientName = RefundMaster.PatientName || '';
      this.GenderName = RefundMaster.GenderName || '';
      this.Total = RefundMaster.Total || 0 ;
      this.PaymentId = RefundMaster.PaymentId || 0;
      this.PaymentDate = RefundMaster.PaymentDate || 0;
      this.CashPayAmount = RefundMaster.CashPayAmount || 0 ;
      this.ChequePayAmount = RefundMaster.ChequePayAmount || 0;
      this.CardPayAmount = RefundMaster.CardPayAmount || 0;
      this.PBillNo = RefundMaster.PBillNo || 0;
      this.RegNo = RefundMaster.RegNo || 0;
      this.TotalAmt = RefundMaster.TotalAmt || 0;
      this.Remark = RefundMaster.Remark || 0;
    }
  }
}


export class BrowseIpdreturnadvanceReceipt
{
    PaymentId: Number;
    BillNo: Number;
    RegNo: number;
    RegId: number;
    IPDNo:any;
    PatientName: string;
    FirstName: string;
    MiddleName: string; 
    LastName: string;
    Age:number;
    TotalAmt: number;
    BalanceAmt: number;
    GenderName:string;
    Remark: string;
    PaymentDate: any;
    CashPayAmount : number;
    ChequePayAmount : number;
    CardPayAmount : number;
    AdvanceUsedAmount: number;
    AdvanceId:number;
    RefundId: number;
    IsCancelled: boolean;
    AddedByName: number;
    UserName:string;
    PBillNo: string;
    ReceiptNo: string;
    TransactionType:number;
    PayDate:Date;
    PaidAmount: number;
    NEFTPayAmount:number;
    PayTMAmount: number;
    AddedBy:string;
    RefundDate:Date;
    RefundAmount:number;
    RefundNo:number;
    BillId:number;
     BillDate:any;
     NetPayableAmt:any;
     OPDNo:any;
     ConsultantDoctorName:any;
     HospitalName:any;
     HospitalAddress:any;
     Phone:any;
     EmailId:any;
     

    /**
     * Constructor
     *
     * @param BrowseIpdreturnadvanceReceipt
     */
    constructor(BrowseIpdreturnadvanceReceipt) {
        {
            this.PaymentId = BrowseIpdreturnadvanceReceipt.PaymentId || '';
            this.BillNo = BrowseIpdreturnadvanceReceipt.BillNo || '';
            this.RegNo = BrowseIpdreturnadvanceReceipt.RegNo || '';
            this.RegId = BrowseIpdreturnadvanceReceipt.RegId || '';
            this.PatientName = BrowseIpdreturnadvanceReceipt.PatientName || '';
            this.FirstName = BrowseIpdreturnadvanceReceipt.FirstName || '';
            this.MiddleName = BrowseIpdreturnadvanceReceipt.MiddleName || '';
            this.IPDNo=BrowseIpdreturnadvanceReceipt.IPDNo||'';
            this.Age = BrowseIpdreturnadvanceReceipt.Age || '';
            this.TotalAmt = BrowseIpdreturnadvanceReceipt.TotalAmt || '';
            this.BalanceAmt = BrowseIpdreturnadvanceReceipt.BalanceAmt || '';
            this.Remark = BrowseIpdreturnadvanceReceipt.Remark || '';
            this.PaymentDate = BrowseIpdreturnadvanceReceipt.PaymentDate || '';
            this.CashPayAmount = BrowseIpdreturnadvanceReceipt.CashPayAmount || '';
            this.ChequePayAmount = BrowseIpdreturnadvanceReceipt.ChequePayAmount || '';
            this.CardPayAmount = BrowseIpdreturnadvanceReceipt.CardPayAmount || '';
            this.AdvanceUsedAmount = BrowseIpdreturnadvanceReceipt.AdvanceUsedAmount || '';
            this.AdvanceId = BrowseIpdreturnadvanceReceipt.AdvanceId || '';
            this.RefundId = BrowseIpdreturnadvanceReceipt.RefundId || '';
            this.IsCancelled = BrowseIpdreturnadvanceReceipt.IsCancelled || '';
            this.AddedByName = BrowseIpdreturnadvanceReceipt.AddedByName || '';
            this.UserName = BrowseIpdreturnadvanceReceipt.UserName || '';
            this.ReceiptNo = BrowseIpdreturnadvanceReceipt.ReceiptNo || '';
            this.PBillNo = BrowseIpdreturnadvanceReceipt.PBillNo || '';
            this.TransactionType = BrowseIpdreturnadvanceReceipt.TransactionType || '';
            this.PayDate = BrowseIpdreturnadvanceReceipt.PayDate || '';
            this.PaidAmount = BrowseIpdreturnadvanceReceipt.PaidAmount || '';
            this.NEFTPayAmount = BrowseIpdreturnadvanceReceipt.NEFTPayAmount || '';
            this.PayTMAmount = BrowseIpdreturnadvanceReceipt.PayTMAmount || '';
            this.RefundDate = BrowseIpdreturnadvanceReceipt.RefundDate || '';
            this.RefundAmount = BrowseIpdreturnadvanceReceipt.RefundAmount|| '';
            this.RefundNo = BrowseIpdreturnadvanceReceipt.RefundNo || ''; 
            this.GenderName = BrowseIpdreturnadvanceReceipt.GenderName || ''; 
            this.AddedBy = BrowseIpdreturnadvanceReceipt.AddedBy || '';
            this.BillId = BrowseIpdreturnadvanceReceipt.BillId || '';
            this.BillDate = BrowseIpdreturnadvanceReceipt.BillDate || '';
            this.NetPayableAmt=BrowseIpdreturnadvanceReceipt.NetPayableAmt ||0;
            this.OPDNo =BrowseIpdreturnadvanceReceipt.OPDNo || 0;
           this.ConsultantDoctorName=BrowseIpdreturnadvanceReceipt.ConsultantDoctorName || 0;

           this.HospitalName = BrowseIpdreturnadvanceReceipt.HospitalName || '';
           this.HospitalAddress=BrowseIpdreturnadvanceReceipt.HospitalAddress ||0;
           this.Phone =BrowseIpdreturnadvanceReceipt.Phone || '';
          this.EmailId=BrowseIpdreturnadvanceReceipt.EmailId || '';
        }

    }
}
