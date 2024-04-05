import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NewBillRaiseComponent } from './new-bill-raise/new-bill-raise.component';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerBillRaiseService } from './customer-bill-raise.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-customer-bill-raise',
  templateUrl: './customer-bill-raise.component.html',
  styleUrls: ['./customer-bill-raise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerBillRaiseComponent implements OnInit {
  displayedColumns: string[] = [
    'InvoiceNo',
    'InvoiceDate',
    'CustomerId',
    'Amount',
    'InvoiceRaisedId',
    'Action'
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;

  dsBillRaiseList =new MatTableDataSource<BillRaiseList>();
  constructor(
    public _CustomerBill: CustomerBillRaiseService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
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
  NewCustomerBill(){
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '100%',
        
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
}
export class BillRaiseList{
  InvoiceNo: any;
  InvoiceDate: any;
  CustomerId: string;
  Amount: string;
  InvoiceRaisedId: any;
  constructor(BillRaiseList) {
    {
      this.InvoiceNo = BillRaiseList.InvoiceNo || 0;
      this.InvoiceDate = BillRaiseList.InvoiceDate || 0;
      this.CustomerId = BillRaiseList.CustomerId || '';
      this.Amount = BillRaiseList.Amount || '';
      this.InvoiceRaisedId = BillRaiseList.InvoiceRaisedId || 0;
    }
  }
}
