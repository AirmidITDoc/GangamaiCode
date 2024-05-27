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
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
@Component({
  selector: 'app-browse-ipadvance',
  templateUrl: './browse-ipadvance.component.html',
  styleUrls: ['./browse-ipadvance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseIPAdvanceComponent implements OnInit {

  chkprint: boolean = false;
  hasSelectedContacts: boolean;
  outputWords=''
  BrowseOPDBillsList:any;
  msg:any;
  sIsLoading: string = "";
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  // @Input() dataArray: any; 
  SpinLoading:boolean=false;
  AdList:boolean=false;

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
    'PayTMAmount',
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
    private reportDownloadService: ExcelDownloadService,
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


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}


  onShow_IpdAdvance(){
    debugger
    var D_data= {
      "F_Name":this._advanceService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name":this._advanceService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt" :this.datePipe.transform(this._advanceService.myFilterform.get("start").value,"MM/dd/yyyy") || "01/01/1900",
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

  

  
viewgetIPAdvanceReportPdf(contact) {
  debugger
  this.chkprint=true;
  this.sIsLoading = 'loading-data';
  setTimeout(() => {
    // this.SpinLoading =true;
   this.AdList=true;
   
  this._advanceService.getViewAdvanceReceipt(
 contact.AdvanceDetailID
  ).subscribe(res => {
    const matDialog = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Ip advance Viewer"
        }
      });
      matDialog.afterClosed().subscribe(result => {
        this.AdList=false;
        this.sIsLoading = '';
      });
  });
 
  },100)
  this.chkprint=false;
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

 
  exportIpadvanceReportExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['RegNo', 'Date', 'PatientName', 'AdvanceNo', 'AdvanceAmount', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'ConcessionAmt','UserName'];
    this.reportDownloadService.getExportJsonData(this.dataArray.data, exportHeaders, 'Ip Advance Datewise');
    this.dataArray.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.dataArray.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.RegNo);
      tempObj.push(e.Date);
      tempObj.push(e.PatientName);
      tempObj.push(e.AdvanceNo);
      tempObj.push(e.AdvanceAmount);
      tempObj.push(e.CashPayAmount);
      tempObj.push(e.ChequePayAmount);
      tempObj.push(e.CardPayAmount);
      tempObj.push(e.UserName);
      actualData.push(tempObj);
    });
    let headers = [['RegNo', 'Date', 'PatientName', 'AdvanceNo', 'AdvanceAmount', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount','ConcessionAmt','UserName']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'IP Advance');
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