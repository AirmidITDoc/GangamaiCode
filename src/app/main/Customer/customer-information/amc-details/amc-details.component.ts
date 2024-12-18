import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CustomerInformationService } from '../customer-information.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerInfoList } from '../customer-information.component';
import { NewBillRaiseComponent } from '../new-bill-raise/new-bill-raise.component';
import Swal from 'sweetalert2';
import { CustomerPaymentComponent } from '../customer-payment/customer-payment.component';
@Component({
  selector: 'app-amc-details',
  templateUrl: './amc-details.component.html',
  styleUrls: ['./amc-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AMCDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'CustomerName',
    'AMCStartDate',
    'AMCDuration',
    'AMCEndDate',
    'AMCAmount',
    'AMCPaidDate',
    'PaymentId'
  ]
  displayedColumnsBillRise: string[] = [
    'InvoiceDate', 
    'CustomerName',
    'Amount', 
    'CreatedBy',
    'Action'
  ];


  registerObj: any;
  isLoading: String = '';
  sIsLoading: string = "";
  chargeslist: any = [];
  vDoctorName: any;
  selectedAdvanceObj: any;
  chargelist:any=[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsAMCDetList = new MatTableDataSource<CustomerInfoList>();
  dsBillRiseList = new MatTableDataSource<BillRaiseList>();

  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<AMCDetailsComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.selectedAdvanceObj = this.data.Obj
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.getAmcDetList();
      this.getCustomerBlilList()
    }

  }

  getAmcDetList() {
    this.isLoading = 'loading-data'
    var vdata = {
      "CustomerId": this.registerObj.CustomerId
    }
    console.log(vdata)
    this._CustomerInfo.getAmcDetList(vdata).subscribe(data => {
      this.dsAMCDetList.data = data as CustomerInfoList[];
      this.dsAMCDetList.sort = this.sort;
      this.dsAMCDetList.paginator = this.paginator
      console.log(this.dsAMCDetList)
    })
  }
  getCustomerBlilList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "CustomerId": this.registerObj.CustomerId
    }
    this._CustomerInfo.getCustomerBillList(vdata).subscribe(data => {
      this.dsBillRiseList.data = data as BillRaiseList[];
      this.chargelist =  data as BillRaiseList[];
      console.log(this.dsBillRiseList.data)
      this.dsBillRiseList.sort = this.sort;
      this.dsBillRiseList.paginator = this.paginator
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  deleteTableRow(element) {
    let index = this.chargelist.indexOf(element);
    if (index >= 0) {
      this.chargelist.splice(index, 1);
      this.dsBillRiseList.data = [];
      this.dsBillRiseList.data = this.chargelist;
    }
    Swal.fire('Success !', 'PacakgeList Row Deleted Successfully', 'success'); 
  }
  onClose() {
    this._matDialog.closeAll();
  }

  PayAMtamt(contact) {
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
      this.getCustomerBlilList();
      this.getAmcDetList();
    }); 
  }
  OnEditBillRise(contact) {
    this.NewBillRise = 0
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "60vw",
        height: '53%',
        width: '100%',
        data:{
          Obj:contact,
          FormName: this.NewBillRise
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCustomerBlilList();
    });
  }
  NewBillRise:any;
  newBillRise() {
    this.NewBillRise = 1
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "60vw",
        height: '53%',
        width: '100%',
        data:{
          Obj:this.registerObj,
          FormName: this.NewBillRise
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCustomerBlilList();
    });
  }
  newAmc(){

  }
}
export class BillRaiseList {
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
