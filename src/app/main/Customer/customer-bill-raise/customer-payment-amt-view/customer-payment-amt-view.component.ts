import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Row } from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { CustomerBillRaiseService } from '../customer-bill-raise.service';
import { log } from 'console';

@Component({
  selector: 'app-customer-payment-amt-view',
  templateUrl: './customer-payment-amt-view.component.html',
  styleUrls: ['./customer-payment-amt-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerPaymentAmtViewComponent implements OnInit {

  sIsLoading: string = '';
  dataSource = new MatTableDataSource<PaymentAmtViewList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'PaymentDate',
    'PaymentTime',
    'ReceiptNumber',
    'CustomerName',
    'Amount',
    'TranType',
  ];

  constructor(
    public _CustomerBill: CustomerBillRaiseService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<CustomerPaymentAmtViewComponent>,
    private _loggedService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  vCustomerId:any;
  ngOnInit(): void {
    if(this.data){
      this.vCustomerId =  this.data.Obj.CustomerId;
    }
    this.getPaymentAmtViewList(this.vCustomerId);
  }

  getPaymentAmtViewList(Param) {
    const C_data = {
      "CustomerId": Param,
    };
    this._CustomerBill.getPaymentAmtViewList(C_data).subscribe(
      data => {
        this.dataSource.data = data as PaymentAmtViewList[]; 
        console.log("data:",this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error("Error loading payment data:", error);
      }
    );
}

onClose() {
  this._CustomerBill.myform.reset();
  this.dialogRef.close();
} 

}
export class PaymentAmtViewList {
  PaymentId: number;
  PaymentDate: any;
  PaymentTime: any;
  ReceiptNumber: number;
  Amount: number;
  TranType: any;
  CustomerName: any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(PaymentAmtViewList) {
    {
      this.PaymentId = PaymentAmtViewList.PaymentId || '';
      this.PaymentDate = PaymentAmtViewList.PaymentDate || '';
      this.PaymentTime = PaymentAmtViewList.PaymentTime || '';
      this.ReceiptNumber = PaymentAmtViewList.ReceiptNumber || 0;
      this.Amount = PaymentAmtViewList.Amount || '';
      this.TranType = PaymentAmtViewList.TranType || '';
      this.CustomerName = PaymentAmtViewList.CustomerName || '';
    }
  }
}
