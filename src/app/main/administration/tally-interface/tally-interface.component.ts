import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TallyInterfaceService } from './tally-interface.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

@Component({
  selector: 'app-tally-interface',
  templateUrl: './tally-interface.component.html',
  styleUrls: ['./tally-interface.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TallyInterfaceComponent implements OnInit {
  displayedColumnsOP: string[] = [
    'BillDate',
    'CashCounterName',
    'NetPayableAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount',
  ];
  displayedColumnsOPRef: string[] = [
    'BillDate',
    'RefundAmount',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount'
  ];
  displayedColumnsAdv1: string[] = [
    'AdvDate',
    'PatientName',
    'RegNo',
    'IPDNo',
    'AdvanceNo',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount'
  ];
  displayedColumnsAdvRef: string[] = [
    'PaymentDate',
    'PatientName',
    'RegNo',
    'IPDNo',
    'RefundNo',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount',
    'ConcessionReason'
  ];
  displayedColumnsIPbill: string[] = [
    'BillDate',
    'PatientName',
    'RegNo',
    'IPDNo',
    'PBillNo',
    'CashCounterName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'ConcessionReason'
  ];
  displayedColumnsIPPayList: string[] = [
    'PaymentDate',
    'PatientName',
    'RegNo',
    'PBillNo',
    'CashCounterName',
    'ReceiptNo',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount',
  ];
  displayedColumnsIPList: string[] = [
    'BillDate',
    'CashCounterName',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount',
    'AdvanceUsedAmount'
  ];
  displayedColumnsIPRefList: string[] = [
    'PaymentDate',
    'PatientName',
    'RegNo',
    'IPDNo',
    'RefundNo', 
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',
    'PayTMAmount',
    'ConcessionReason'
  ];
  sIsLoading: string = '';

  dsOplist = new MatTableDataSource<TallyInterfacelist>();
  dsOpRefundList =new MatTableDataSource<TallyInterfacelist>();
  dsAdvlist = new MatTableDataSource<TallyInterfacelist>();
  dsAdvRefList =new MatTableDataSource<TallyInterfacelist>();

  dsipbilllist =new MatTableDataSource<TallyInterfacelist>();
  dsipPaymentList = new MatTableDataSource<TallyInterfacelist>();
  dsipbillcashcounterwise = new MatTableDataSource<TallyInterfacelist>();
  dsiprefundlist = new MatTableDataSource<TallyInterfacelist>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('OpRefRetPaginator', { static: true }) public OpRefRetPaginator: MatPaginator;
  @ViewChild('IpAdvancePaginator', { static: true }) public IpAdvancePaginator: MatPaginator;
  @ViewChild('IpAdvanceRefPaginator', { static: true }) public IpAdvanceRefPaginator: MatPaginator;
  @ViewChild('IpbillPaginator', { static: true }) public IpbillPaginator: MatPaginator;
  @ViewChild('IpPaymentRefPaginator', { static: true }) public IpPaymentRefPaginator: MatPaginator;


  constructor(
    public _TallyInterfaceService: TallyInterfaceService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private reportDownloadService: ExcelDownloadService,
  ) { }

  ngOnInit(): void {
    this.getoplist();
    this.getAdvancelist();
    this.getipBIlllist();
  }


  getoplist() {
    var vdata = {
      'From_Dt': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdate').value, 'MM/dd/yyyy') || '01/01/1999',
      'To_Dt': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddate').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getOpbilllist(vdata).subscribe(data => {
      this.dsOplist.data = data as TallyInterfacelist[]
      console.log(this.dsOplist.data)
      this.dsOplist.sort = this.sort
      this.dsOplist.paginator = this.paginator
      this.getOpRefundist();
    })
  }
  getOpRefundist() {
    var vdata = {
      'From_Dt': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdate').value, 'MM/dd/yyyy') || '01/01/1999',
      'To_Dt': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddate').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getOpRefundist(vdata).subscribe(data => {
      this.dsOpRefundList.data = data as TallyInterfacelist[]
      console.log(this.dsOpRefundList.data)
      this.dsOpRefundList.sort = this.sort
      this.dsOpRefundList.paginator = this.OpRefRetPaginator
    })
  }
  //Advance lsit
  getAdvancelist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateAdv').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateAdv').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getAdvancelist(vdata).subscribe(data => {
      this.dsAdvlist.data = data as TallyInterfacelist[]
      console.log(this.dsAdvlist.data)
      this.dsAdvlist.sort = this.sort
      this.dsAdvlist.paginator = this.IpAdvancePaginator
    })
    this.getAdvanceReflist();
  }
  getAdvanceReflist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateAdv').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateAdv').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getAdvanceReflist(vdata).subscribe(data => {
      this.dsAdvRefList.data = data as TallyInterfacelist[]
      console.log(this.dsAdvRefList.data)
      this.dsAdvRefList.sort = this.sort
      this.dsAdvRefList.paginator = this.IpAdvanceRefPaginator
    })
  }
  //ip list
  getipBIlllist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipBIlllist(vdata).subscribe(data => {
      this.dsipbilllist.data = data as TallyInterfacelist[]
      console.log(this.dsipbilllist.data)
      this.dsipbilllist.sort = this.sort
      this.dsipbilllist.paginator = this.IpbillPaginator
    })
    this.getippaymentwiselist();
    this.getipbillcashcounterlist();
    this.getipbillRefundlist();
  }
  getippaymentwiselist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getippaymentwiselist(vdata).subscribe(data => {
      this.dsipPaymentList.data = data as TallyInterfacelist[]
      console.log(this.dsipPaymentList.data)
      this.dsipPaymentList.sort = this.sort
      this.dsipPaymentList.paginator = this.IpPaymentRefPaginator
    })
  }

  getipbillcashcounterlist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipbillcashcounterlist(vdata).subscribe(data => {
      this.dsipbillcashcounterwise.data = data as TallyInterfacelist[]
      console.log(this.dsipbillcashcounterwise.data)
      this.dsipbillcashcounterwise.sort = this.sort
      this.dsipbillcashcounterwise.paginator = this.IpPaymentRefPaginator
    })
  }

  getipbillRefundlist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipbillRefundlist(vdata).subscribe(data => {
      this.dsiprefundlist.data = data as TallyInterfacelist[]
      console.log(this.dsiprefundlist.data)
      this.dsiprefundlist.sort = this.sort
      this.dsiprefundlist.paginator = this.IpPaymentRefPaginator
    })
  }

  //op execl export
  getopbilllexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BillDate', 'CashCounterName', 'NetPayableAmt', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount'];
    this.reportDownloadService.getExportJsonData(this.dsOplist.data, exportHeaders, ' OP Cash Counter Wise');
    this.dsOplist.data = [];
    this.sIsLoading = '';
  }
  getopbilllrefexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BillDate', 'RefundAmount', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount'];
    this.reportDownloadService.getExportJsonData(this.dsOpRefundList.data, exportHeaders, ' OP Daily Wise Refund');
    this.dsOpRefundList.data = [];
    this.sIsLoading = '';
  }
  //ip execl export
  getibilllexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BillDate', 'PatientName', 'RegNo', 'IPDNo', 'PBillNo', 'CashCounterName', 'TotalAmt', 'ConcessionAmt', 'NetPayableAmt', 'ConcessionReason'];
    this.reportDownloadService.getExportJsonData(this.dsipbilllist.data, exportHeaders, ' IP Bill Patient Wise');
    //this.dsipbilllist.data = [];
    this.sIsLoading = '';
  }
  getipPaymentexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['PaymentDate', 'PatientName', 'RegNo', 'PBillNo', 'CashCounterName', 'ReceiptNo', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount'];
    this.reportDownloadService.getExportJsonData(this.dsipPaymentList.data, exportHeaders, ' IP Payment Patient Wise');
   // this.dsipPaymentList.data = [];
    this.sIsLoading = '';
  }
  getibilllCashCounterexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BillDate', 'CashCounterName', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount', 'AdvanceUsedAmount'];
    this.reportDownloadService.getExportJsonData(this.dsipbillcashcounterwise.data, exportHeaders, '  IP Cash Counter Wise');
   // this.dsipbillcashcounterwise.data = [];
    this.sIsLoading = '';
  }
  getiprefundexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['PaymentDate', 'PatientName', 'RegNo', 'IPDNo', 'RefundNo', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount', 'ConcessionReason'];
    this.reportDownloadService.getExportJsonData(this.dsiprefundlist.data, exportHeaders, ' IP Patient Wise Refund');
   // this.dsOpRefundList.data = [];
    this.sIsLoading = '';
  }
  //ip Advance execl export
  getIPAdvancelexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['AdvDate', 'PatientName', 'RegNo', 'IPDNo', 'AdvanceNo', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount'];
    this.reportDownloadService.getExportJsonData(this.dsAdvlist.data, exportHeaders, ' Advance Patient Wise');
   // this.dsAdvlist.data = [];
    this.sIsLoading = '';
  }
  getIPAdvanceRefundexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['PaymentDate', 'PatientName', 'RegNo', 'IPDNo', 'RefundNo', 'CashPayAmount', 'ChequePayAmount', 'CardPayAmount', 'NEFTPayAmount', 'PayTMAmount', 'ConcessionReason'];
    this.reportDownloadService.getExportJsonData(this.dsAdvRefList.data, exportHeaders, 'Advance Refund Patient Wise');
    // this.dsAdvRefList.data = [];
    this.sIsLoading = '';
  }
}
 
export class TallyInterfacelist{
  RegNo:any;
  PatientName:string;
  BillAmt:number; 
  NetpayableAmt: number;
  BillDate:number;
  PBillNo:number; 
  PaymentDate:any;
  CashCounterName:string;
  ReceiptNo:number;
  CashPayAmount: Number;
  CardPayAmount: number;
  ChequePayAmount:number;
  NEFTPayAmount:number;
  PayTMAmount:number;
  AdvanceUsedAmount:number;
  IPDNo:number;
  AdvanceNo:number;
  TotalAmt: number;
  ConcessionAmt:number;
  NetPayableAmt:number;
  ConcessionReason:string;
  remark:string;
  RefundNo:any; 
  RefundAmount:number;
  constructor(TallyInterface) {
    {
      this.RegNo = TallyInterface.RegNo || 0;
      this.PatientName = TallyInterface.PatientName || "";
      this.BillAmt = TallyInterface.BillAmt || 0;
      this.RefundAmount = TallyInterface.RefundAmount || 0;
      this.NetpayableAmt = TallyInterface.NetpayableAmt || 0;
      this.BillDate = TallyInterface.BillDate || 0;
      this.PBillNo = TallyInterface.PBillNo || 0;  
      this.PaymentDate = TallyInterface.PaymentDate || 0;
      this.ReceiptNo = TallyInterface.ReceiptNo || 0;
      this.CashPayAmount = TallyInterface.CashPayAmount || 0;
      this.CardPayAmount = TallyInterface.CardPayAmount || 0; 
      this.ConcessionReason = TallyInterface.ConcessionReason || "";
      this.remark = TallyInterface.remark || "";
      this.CashCounterName = TallyInterface.CashCounterName || "";
      this.ChequePayAmount = TallyInterface.ChequePayAmount || 0;
      this.PayTMAmount = TallyInterface.PayTMAmount || 0;
      this.NEFTPayAmount = TallyInterface.NEFTPayAmount || 0;
      this.AdvanceUsedAmount = TallyInterface.AdvanceUsedAmount || 0;   
      this.IPDNo = TallyInterface.IPDNo || 0;
      this.AdvanceNo = TallyInterface.AdvanceNo || 0;
      this.TotalAmt = TallyInterface.TotalAmt || 0;
      this.ConcessionAmt = TallyInterface.ConcessionAmt || 0;   
      this.RefundNo = TallyInterface.RefundNo || 0;  
    }
  }
}  