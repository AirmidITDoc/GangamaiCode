import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TallyInterfaceService } from '../tally-interface.service';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-tally',
  templateUrl: './new-tally.component.html',
  styleUrls: ['./new-tally.component.scss']
})
export class NewTallyComponent implements OnInit {

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

  displayedColumnsPur: string[] = [ 
    'SupplierName',
    'GRNDate',
    'GrnNumber',
    'InvoiceNo',
    'CGSTPer', 
    'CGSTAmt',
    'SGSTPer',
    'SGSTAmt',
    'IGSTPer',
    'IGSTAmt',
    'VatPercentage',
    'VatAmount',
    'MRP',
    'PTR',
    'DISCOUNTAMOUNT',
    'TOTALBILLAMOUNT' 
  ];
  displayedColumnsPhsales: string[] = [ 
    'MDate',
    'DEBIT',
    'CREDIT', 
    'CashPay',
    'SrNo' 
  ]; 

  sIsLoading: string = '';
  isStoreSelected:boolean=false;
  isPurStoreSelected:boolean=false;
  StoreList:any=[];
  PurStoreList:any=[];
  filteredOptionsStorename:Observable<string[]>
  filteredOptionsPurStorename:Observable<string[]>

  dsOplist = new MatTableDataSource<TallyInterfacelist>();
  dsOpRefundList =new MatTableDataSource<TallyInterfacelist>();
  dsAdvlist = new MatTableDataSource<TallyInterfacelist>();
  dsAdvRefList =new MatTableDataSource<TallyInterfacelist>();

  dsipbilllist =new MatTableDataSource<TallyInterfacelist>();
  dsipPaymentList = new MatTableDataSource<TallyInterfacelist>();
  dsipbillcashcounterwise = new MatTableDataSource<TallyInterfacelist>();
  dsiprefundlist = new MatTableDataSource<TallyInterfacelist>();

  dsPurchaselist = new MatTableDataSource<TallyInterfacelist>();

  dsPharmaSaleslist =new MatTableDataSource<TallyInterfacelist>();
  dsPharmaSalesPaymentlist =new MatTableDataSource<TallyInterfacelist>();
  dsPharmaSalesReturnlist =new MatTableDataSource<TallyInterfacelist>();
  dsPharmaSalesReceiptlist =new MatTableDataSource<TallyInterfacelist>();
 


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('OpRefRetPaginator', { static: true }) public OpRefRetPaginator: MatPaginator;
  @ViewChild('IpAdvancePaginator', { static: true }) public IpAdvancePaginator: MatPaginator;
  @ViewChild('IpAdvanceRefPaginator', { static: true }) public IpAdvanceRefPaginator: MatPaginator;
  @ViewChild('PurchasePaginator', { static: true }) public PurchasePaginator: MatPaginator;
  @ViewChild('IpPaymentRefPaginator', { static: true }) public IpPaymentRefPaginator: MatPaginator;


  constructor(
    public _TallyInterfaceService: TallyInterfaceService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private reportDownloadService: ExcelDownloadService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList1();
    this.gePurStoreList1();
    this.getoplist();
    this.getAdvancelist();
    this.getipBIlllist();
    this.getPurcahselist();
    this.getPharmacylist();
  }


  getoplist() {
    var vdata = {
      'From_Dt': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdate').value, 'MM/dd/yyyy') || '01/01/1999',
      'To_Dt': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddate').value, 'MM/dd/yyyy') || '01/01/1999'
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
      'From_Dt': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdate').value, 'MM/dd/yyyy') || '01/01/1999',
      'To_Dt': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddate').value, 'MM/dd/yyyy') || '01/01/1999'
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
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdateAdv').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddateAdv').value, 'MM/dd/yyyy') || '01/01/1999'
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
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdateAdv').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddateAdv').value, 'MM/dd/yyyy') || '01/01/1999'
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
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipBIlllist(vdata).subscribe(data => {
      this.dsipbilllist.data = data as TallyInterfacelist[]
      console.log(this.dsipbilllist.data) 
    })
    this.getippaymentwiselist();
    this.getipbillcashcounterlist();
    this.getipbillRefundlist();
  }
  getippaymentwiselist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getippaymentwiselist(vdata).subscribe(data => {
      this.dsipPaymentList.data = data as TallyInterfacelist[]
      console.log(this.dsipPaymentList.data) 
    })
  }

  getipbillcashcounterlist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipbillcashcounterlist(vdata).subscribe(data => {
      this.dsipbillcashcounterwise.data = data as TallyInterfacelist[]
      console.log(this.dsipbillcashcounterwise.data) 
    })
  }

  getipbillRefundlist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdateIP').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddateIP').value, 'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipbillRefundlist(vdata).subscribe(data => {
      this.dsiprefundlist.data = data as TallyInterfacelist[]
      console.log(this.dsiprefundlist.data) 
    })
  }
//Purchase list
getPurcahselist() {
  var vdata = {
    'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdatePurchase').value, 'MM/dd/yyyy') || '01/01/1999',
    'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddatePurchase').value, 'MM/dd/yyyy') || '01/01/1999',
    'StoreID':this._TallyInterfaceService.myformSearch.get('PurStoreId').value.StoreId || 0
  }
  console.log(vdata)
  this._TallyInterfaceService.getPurcahselist(vdata).subscribe(data => {
    this.dsPurchaselist.data = data as TallyInterfacelist[]
    console.log(this.dsPurchaselist.data)
    this.dsPurchaselist.sort = this.sort
    this.dsPurchaselist.paginator = this.PurchasePaginator
  })
}
  //Phamacy list
  getPharmacylist() {
    var vdata = {
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('startdatePharma').value, 'MM/dd/yyyy') || '01/01/1999',
      'ToDate': this.datePipe.transform(this._TallyInterfaceService.myformSearch.get('enddatePharma').value, 'MM/dd/yyyy') || '01/01/1999',
      'StoreId':this._TallyInterfaceService.myformSearch.get('StoreId').value.StoreId || 0
    }
    console.log(vdata)
    this._TallyInterfaceService.getPharmacylist(vdata).subscribe(data => {
      this.dsPharmaSaleslist.data = data as TallyInterfacelist[]
      console.log(this.dsPharmaSaleslist.data) 
    })
 
    this._TallyInterfaceService.getPharmaSalesreceiptlist(vdata).subscribe(data => {
      this.dsPharmaSalesReceiptlist.data = data as TallyInterfacelist[]
      console.log(this.dsPharmaSalesReceiptlist.data) 
    })

    this._TallyInterfaceService.getPharmaSalesReturnlist(vdata).subscribe(data => {
      this.dsPharmaSalesReturnlist.data = data as TallyInterfacelist[]
      console.log(this.dsPharmaSalesReturnlist.data) 
    })

    this._TallyInterfaceService.getPharmaPaymentlist(vdata).subscribe(data => {
      this.dsPharmaSalesPaymentlist.data = data as TallyInterfacelist[]
      console.log(this.dsPharmaSalesPaymentlist.data) 
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
  //Purchase excel export
  getPurchaseexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['SupplierName', 'GRNDate', 'GrnNumber', 'InvoiceNo', 'CGSTPer', 'CGSTAmt', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'VatPercentage','VatAmount','MRP','PTR','DISCOUNTAMOUNT','TOTALBILLAMOUNT'];
    this.reportDownloadService.getExportJsonData(this.dsPurchaselist.data, exportHeaders, 'Purchase Wise Supplier');
    // this.dsPurchaselist.data = [];
    this.sIsLoading = '';
  }
   //Pharmacy sales excel export
   getPhSalesexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['MDate', 'DEBIT', 'CREDIT', 'CashPay', 'SrNo' ];
    this.reportDownloadService.getExportJsonData(this.dsPharmaSaleslist.data, exportHeaders, 'Pharmacy sales list');
    // this.dsPharmaSaleslist.data = [];
    this.sIsLoading = '';
  }
  getPhPaymentexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['MDate', 'DEBIT', 'CREDIT', 'CashPay', 'SrNo' ];
    this.reportDownloadService.getExportJsonData(this.dsPharmaSalesPaymentlist.data, exportHeaders, 'Pharmacy Payment list');
    // this.dsPharmaSalesPaymentlist.data = [];
    this.sIsLoading = '';
  }
  getPhSalesReturnexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['MDate', 'DEBIT', 'CREDIT', 'CashPay', 'SrNo' ];
    this.reportDownloadService.getExportJsonData(this.dsPharmaSalesReturnlist.data, exportHeaders, 'Pharmacy Sales Retrun list');
    // this.dsPharmaSalesReturnlist.data = [];
    this.sIsLoading = '';
  }
  getPhSalesReceiptexcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['MDate', 'DEBIT', 'CREDIT', 'CashPay', 'SrNo' ];
    this.reportDownloadService.getExportJsonData(this.  dsPharmaSalesReceiptlist.data, exportHeaders, 'Pharmacy Sales Receipt list');
    // this.dsPharmaSalesReceiptlist.data = [];
    this.sIsLoading = '';
  }

    gePharStoreList1() {
      this._TallyInterfaceService.getStoreList().subscribe(data => {
        this.StoreList = data;
        this.filteredOptionsStorename = this._TallyInterfaceService.myformSearch.get('StoreId').valueChanges.pipe(
          startWith(''), 
          map(value => value ? this._filterStore(value) : this.StoreList.slice()),
        ); 
      });
    }
    private _filterStore(value: any): string[] {
      if (value) {
        const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
        return this.StoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
      }
    }
    getOptionTextStoreName(option) {
      return option && option.StoreName ? option.StoreName : '';
    }

    gePurStoreList1() {
      this._TallyInterfaceService.getStoreList().subscribe(data => {
        this.PurStoreList = data;
        this.filteredOptionsPurStorename = this._TallyInterfaceService.myformSearch.get('PurStoreId').valueChanges.pipe(
          startWith(''), 
          map(value => value ? this._filterPurStore(value) : this.PurStoreList.slice()),
        ); 
      });
    }
    private _filterPurStore(value: any): string[] {
      if (value) {
        const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
        return this.PurStoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
      }
    }
    getOptionTextPurStoreName(option) {
      return option && option.StoreName ? option.StoreName : '';
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


  regNo:any;
  patientName:string;
  billAmt:number; 
  netpayableAmt: number;
  billDate:number;
  pBillNo:number; 
  paymentDate:any;
  cashCounterName:string;
  receiptNo:number;
  cashPayAmount: Number;
  cardPayAmount: number;
  chequePayAmount:number;
  nEFTPayAmount:number;
  payTMAmount:number;
  advanceUsedAmount:number;
  iPDNo:number;
  advanceNo:number;
  totalAmt: number;
  concessionAmt:number;
  netPayableAmt:number;
  concessionReason:string;
  refundNo:any; 
  refundAmount:number;
  constructor(TallyInterface) {
    {
      this.regNo = TallyInterface.regNo || 0;
      this.patientName = TallyInterface.patientName || "";
      this.billAmt = TallyInterface.billAmt || 0;
      this.refundAmount = TallyInterface.refundAmount || 0;
      this.netpayableAmt = TallyInterface.netpayableAmt || 0;
      this.billDate = TallyInterface.billDate || 0;
      this.pBillNo = TallyInterface.pBillNo || 0;  
      this.paymentDate = TallyInterface.paymentDate || 0;
      this.receiptNo = TallyInterface.receiptNo || 0;
      this.cashPayAmount = TallyInterface.cashPayAmount || 0;
      this.cardPayAmount = TallyInterface.cardPayAmount || 0; 
      this.concessionReason = TallyInterface.concessionReason || "";
      this.remark = TallyInterface.remark || "";
      this.cashCounterName = TallyInterface.cashCounterName || "";
      this.chequePayAmount = TallyInterface.chequePayAmount || 0;
      this.payTMAmount = TallyInterface.payTMAmount || 0;
      this.nEFTPayAmount = TallyInterface.nEFTPayAmount || 0;
      this.advanceUsedAmount = TallyInterface.advanceUsedAmount || 0;   
      this.iPDNo = TallyInterface.iPDNo || 0;
      this.advanceNo = TallyInterface.advanceNo || 0;
      this.totalAmt = TallyInterface.totalAmt || 0;
      this.concessionAmt = TallyInterface.concessionAmt || 0;   
      this.refundNo = TallyInterface.refundNo || 0;  
    }
  }
}  