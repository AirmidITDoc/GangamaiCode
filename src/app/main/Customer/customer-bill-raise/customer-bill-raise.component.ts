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

@Component({
  selector: 'app-customer-bill-raise',
  templateUrl: './customer-bill-raise.component.html',
  styleUrls: ['./customer-bill-raise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerBillRaiseComponent implements OnInit {
  displayedDueColumns: string[] = [
    'InvoiceDate',
    'InvNumber',
    'CustomerName',
    'ContactPersonMobileNo',
    'Amount',
    'PaymentAmount',
    'PaymentDue'
  ];
  displayedColumns: string[] = [
    'CustomerName',
    'ContactPersonName',
    'ContactPersonMobileNo',
    'AMCPaidDate',
    'AMCAmount',
    'Action'
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;

  dsBillPayDueList =new MatTableDataSource<BillPayDueList>();
  dsAMCPayList =new MatTableDataSource<BillPayDueList>();

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
  NewCustomerBill(){
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "75vw",
        height: '75%',
        width: '100%',
        
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  OnEdit(contact){
    console.log(contact)
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "75vw",
        height: '55%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
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
