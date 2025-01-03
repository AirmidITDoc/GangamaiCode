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
import { CustomerNewAMCComponent } from '../customer-new-amc/customer-new-amc.component';
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
    'AMCEndDate',
    'AMCDuration',
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
  // isLoading: String = '';
  isLoading = true;
  sIsLoading: string = "";
  chargeslist: any = [];
  vDoctorName: any;
  selectedAdvanceObj: any;
  chargelist: any = [];

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
    var vdata = {
      "CustomerId": this.registerObj.CustomerId
    }
    this._CustomerInfo.getCustomerBillList(vdata).subscribe(data => {
      this.dsBillRiseList.data = data as BillRaiseList[];
      this.chargelist = data as BillRaiseList[];
      console.log(this.dsBillRiseList.data)
      this.dsBillRiseList.sort = this.sort;
      this.dsBillRiseList.paginator = this.paginator
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  CancleAMCInformation(contact) {
    console.log(contact);
    Swal.fire({
      title: 'Do you want to cancel the AMC?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        let AmcCancle = {};
        AmcCancle['amcId'] = contact.TranId,
        AmcCancle['isCancelledBy'] = this._loggedService.currentUserValue.user.id;

        let submitData = {
          "customerAmcCancel": AmcCancle
        };

        console.log(submitData);

        this.isLoading = true;

        this._CustomerInfo.AMCInformationCancle(submitData).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Record Cancelled Successfully.', 'Cancelled!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Record Data not Cancelled! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
            this.getAmcDetList();

            this.isLoading = false;
          },
          (error) => {

            this.toastr.error('An error occurred while canceling the appointment.', 'Error!', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this.isLoading = false;
          }
        );
      } else {
        this.getAmcDetList();
      }
    });
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
        data: {
          Obj: contact
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
        data: {
          Obj: contact,
          FormName: this.NewBillRise
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCustomerBlilList();
    });
  }
  NewBillRise: any;
  newBillRise() {
    this.NewBillRise = 1
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "60vw",
        height: '53%',
        width: '100%',
        data: {
          Obj: this.registerObj,
          FormName: this.NewBillRise
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCustomerBlilList();
    });
  }
  NewAMC:any=1
  newAmc() { 
    const dialogRef = this._matDialog.open(CustomerNewAMCComponent,
      {
        maxWidth: "60vw",
        height: '53%',
        width: '100%',
        data: { 
          Obj: this.registerObj,
          FormName: this.NewAMC,
          isDate: false 
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getAmcDetList();
    });
  }
  OnEditAMC(contact) {  
    this.NewAMC = 0
    const dialogRef = this._matDialog.open(CustomerNewAMCComponent,
      {
        maxWidth: "60vw",
        height: '53%',
        width: '100%',
        data: {
          Obj: contact,
          FormName: this.NewAMC,
          isDate: true 
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getAmcDetList();
    });
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
