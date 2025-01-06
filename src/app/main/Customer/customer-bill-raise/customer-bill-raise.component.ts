import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NewBillRaiseComponent } from './new-bill-raise/new-bill-raise.component';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerBillRaiseService } from './customer-bill-raise.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CustomerPaymentComponent } from '../customer-information/customer-payment/customer-payment.component';
import { CustomerPaymentAmtViewComponent } from './customer-payment-amt-view/customer-payment-amt-view.component';

@Component({
  selector: 'app-customer-bill-raise',
  templateUrl: './customer-bill-raise.component.html',
  styleUrls: ['./customer-bill-raise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerBillRaiseComponent implements OnInit {
  displayedDueColumns: string[] = [
    'Type',
    'InvoiceDate',
    'InvNumber',
    'CustomerName',
    'ContactPersonMobileNo',
    'Amount',
    'PaymentAmount',
    'PaymentDue'
  ];
  displayedColumns: string[] = [
    'Type',
    'CustomerName',
    'ContactPersonName',
    'ContactPersonMobileNo',
    'AMCPaidDate',
    'AMCAmount',
    'Action'
  ];

  dcPayMonthSummary: string[] = [
    'PayMonth',
    'Amount',
    'Action'
  ];

  dcPayReceivedList: string[] = [
    'Type',
    'PaymentDate',
    'CustomerName',
    'Amount',
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;

  dsBillPayDueList =new MatTableDataSource<BillPayDueList>();
  dsAMCPayList =new MatTableDataSource<BillPayDueList>();
  dsPayMonthSummary =new MatTableDataSource<PayMonthSummary>();
  dsPayReceivedList =new MatTableDataSource<PayReceivedList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _CustomerBill: CustomerBillRaiseService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getCustomerPayDueList();
    this.getCustomerAMCPayList();
    this.getCustomerPayMonthSummary();
  }
  onClose(){
    this._matDialog.closeAll();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getCustomerPayDueList(){ 
    this.sIsLoading = 'loading-data';
    this._CustomerBill.getCustomerPayDueList().subscribe(data =>{
      this.dsBillPayDueList.data = data as BillPayDueList[];
      console.log(this.dsBillPayDueList.data)
      this.dsBillPayDueList.sort = this.sort;
      this.dsBillPayDueList.paginator = this.paginator
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }
  getCustomerAMCPayList(){ 
    this.sIsLoading = 'loading-data';
    this._CustomerBill.getCustomerAMCPayList().subscribe(data =>{
      this.dsAMCPayList.data = data as BillPayDueList[];
      console.log(this.dsAMCPayList.data)
      this.dsAMCPayList.sort = this.sort;
      this.dsAMCPayList.paginator = this.paginator
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }
  getCustomerPayMonthSummary(){ 
    this._CustomerBill.getCustomerPayMonthSummary().subscribe(data =>{
      this.dsPayMonthSummary.data = data as PayMonthSummary[];
      console.log(this.dsPayMonthSummary.data)
      this.dsPayMonthSummary.sort = this.sort;
      this.dsPayMonthSummary.paginator = this.paginator
     
    },
    error => {
      this.sIsLoading = '';
    });
  }
  
  OnViewPaymentReceivedList(param){
    this.getCustomerPayReceivedList(param);
  }
  getCustomerPayReceivedList(Param){ 
    var mdata={
      "PayMonth" : Param.PayMonthNumber
    }
    this._CustomerBill.getCustomerPayReceivedList(mdata).subscribe(data =>{
      this.dsPayReceivedList.data = data as PayReceivedList[];
      console.log(this.dsPayReceivedList.data)
      this.dsPayReceivedList.sort = this.sort;
      this.dsPayReceivedList.paginator = this.paginator
    },
    error => {
      this.sIsLoading = '';
    });
  }

  NewCustomerBill(){
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "80vw",
        height: '75%',
        width: '100%',
        
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  OnEdit(contact){
    console.log(contact)
    const dialogRef = this._matDialog.open(CustomerPaymentComponent,
      {
        maxWidth: "50vw",
        height: '53%',
        width: '100%',
        data:{
          Obj:contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCustomerPayDueList();
    });
  }
  OnView(contact){
    console.log(contact)
    const dialogRef = this._matDialog.open(CustomerPaymentAmtViewComponent,
      {
        maxWidth: "50vw",
        height: '50%',
        width: '100%',
        data:{
          Obj:contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - View Action', result);
      this.getCustomerPayDueList();
    });
  }
}
export class BillPayDueList{
  InvoiceNo: any;
  InvoiceDate: any;
  CustomerId: string;
  Amount: string;
  InvoiceRaisedId: any;
  constructor(BillPayDueList) {
    {
      this.InvoiceNo = BillPayDueList.InvoiceNo || 0;
      this.InvoiceDate = BillPayDueList.InvoiceDate || 0;
      this.CustomerId = BillPayDueList.CustomerId || '';
      this.Amount = BillPayDueList.Amount || '';
      this.InvoiceRaisedId = BillPayDueList.InvoiceRaisedId || 0;
    }
  }
}

export class PayMonthSummary{
  PayMonth: any;
  Amount: string;
  constructor(PayMonthSummary) {
    {
      this.PayMonth = PayMonthSummary.PayMonth;
      this.Amount = PayMonthSummary.Amount || 0;
    }
  }
}

export class PayReceivedList{
  Type:string;
  PaymentDate: any;
  CustomerName:string;
  Amount: string;
  PayMonthNumber:any;
  constructor(PayReceivedList) {
    {
      this.Type = PayReceivedList.Type || '';
      this.CustomerName = PayReceivedList.CustomerName || '';
      this.PaymentDate = PayReceivedList.PaymentDate;
      this.Amount = PayReceivedList.Amount || 0;
      this.PayMonthNumber = PayReceivedList.PayMonthNumber || 0;
    }
  }
}
