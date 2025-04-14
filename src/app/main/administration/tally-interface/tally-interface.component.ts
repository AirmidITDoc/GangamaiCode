import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TallyInterfaceService } from './tally-interface.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tally-interface',
  templateUrl: './tally-interface.component.html',
  styleUrls: ['./tally-interface.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TallyInterfaceComponent implements OnInit {
  displayedColumnsOP:string[] = [ 
    'BillDate',
    'CashCounterName',
    'NetPayableAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',  
    'NEFTPayAmount', 
    'PayTMAmount', 
  ]; 
  displayedColumnsOPRef:string[] = [ 
    'BillDate',
    'RefundAmount',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'NEFTPayAmount',  
    'PayTMAmount' 
  ]; 
  displayedColumnsAdv1:string[] = [ 
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
  displayedColumnsAdvRef:string[] = [ 
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
    'remark'
  ];
  displayedColumnsIPbill:string[] = [ 
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
  displayedColumnsIPPayList:string[] = [ 
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
 
  sIsLoading: string = ''; 
  
  dsOplist = new MatTableDataSource();
  dsOpRefundList = new MatTableDataSource();
  dsAdvlist = new MatTableDataSource();
  dsAdvRefList = new MatTableDataSource();

  dsipbilllist = new MatTableDataSource();
  dsipPaymentList = new MatTableDataSource();

 

   @ViewChild(MatSort) sort:MatSort;
   @ViewChild(MatPaginator) paginator:MatPaginator;
   @ViewChild('OpRefRetPaginator', { static: true }) public OpRefRetPaginator: MatPaginator;
   @ViewChild('IpAdvancePaginator', { static: true }) public IpAdvancePaginator: MatPaginator;
   @ViewChild('IpAdvanceRefPaginator', { static: true }) public IpAdvanceRefPaginator: MatPaginator;
   @ViewChild('IpbillPaginator', { static: true }) public IpbillPaginator: MatPaginator;
   @ViewChild('IpPaymentRefPaginator', { static: true }) public IpPaymentRefPaginator: MatPaginator;
 

  constructor(
 public _TallyInterfaceService : TallyInterfaceService,
     public datePipe: DatePipe, 
     public _matDialog: MatDialog,
     public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getoplist(); 
    this.getAdvancelist(); 
    this.getipBIlllist();
  } 
 

  getoplist(){
    var vdata={
      'From_Dt': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdate').value ,'MM/dd/yyyy') || '01/01/1999',
      'To_Dt':this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddate').value ,'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getOpbilllist(vdata).subscribe(data=>{
      this.dsOplist.data = data as []
      console.log(this.dsOplist.data)
      this.dsOplist.sort = this.sort
      this.dsOplist.paginator = this.paginator
      this.getOpRefundist();
    })
  }
  getOpRefundist(){
    var vdata={
      'From_Dt': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdate').value ,'MM/dd/yyyy') || '01/01/1999',
      'To_Dt':this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddate').value ,'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getOpRefundist(vdata).subscribe(data=>{
      this.dsOpRefundList.data = data as []
      console.log(this.dsOpRefundList.data)
      this.dsOpRefundList.sort = this.sort
      this.dsOpRefundList.paginator = this.OpRefRetPaginator
    })
  }
  //Advance lsit
  getAdvancelist(){
    var vdata={
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateAdv').value ,'MM/dd/yyyy') || '01/01/1999',
      'ToDate':this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateAdv').value ,'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getAdvancelist(vdata).subscribe(data=>{
      this.dsAdvlist.data = data as []
      console.log(this.dsAdvlist.data)
      this.dsAdvlist.sort = this.sort
      this.dsAdvlist.paginator = this.IpAdvancePaginator
    })
    this.getAdvanceReflist();
  }
  getAdvanceReflist(){
    var vdata={
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateAdv').value ,'MM/dd/yyyy') || '01/01/1999',
      'ToDate':this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateAdv').value ,'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getAdvanceReflist(vdata).subscribe(data=>{
      this.dsAdvRefList.data = data as []
      console.log(this.dsAdvRefList.data)
      this.dsAdvRefList.sort = this.sort
      this.dsAdvRefList.paginator = this.IpAdvanceRefPaginator
    })
  }
  //ip list
  getipBIlllist(){
    var vdata={
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateIP').value ,'MM/dd/yyyy') || '01/01/1999',
      'ToDate':this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateIP').value ,'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getipBIlllist(vdata).subscribe(data=>{
      this.dsipbilllist.data = data as []
      console.log(this.dsipbilllist.data)
      this.dsipbilllist.sort = this.sort
      this.dsipbilllist.paginator = this.IpbillPaginator
    })
    this.getippaymentwiselist();
  }
  getippaymentwiselist(){
    var vdata={
      'FromDate': this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('startdateIP').value ,'MM/dd/yyyy') || '01/01/1999',
      'ToDate':this.datePipe.transform(this._TallyInterfaceService.tallyForm.get('enddateIP').value ,'MM/dd/yyyy') || '01/01/1999'
    }
    console.log(vdata)
    this._TallyInterfaceService.getippaymentwiselist(vdata).subscribe(data=>{
      this.dsipPaymentList.data = data as []
      console.log(this.dsipPaymentList.data)
      this.dsipPaymentList.sort = this.sort
      this.dsipPaymentList.paginator = this.IpPaymentRefPaginator
    })
  }
}
