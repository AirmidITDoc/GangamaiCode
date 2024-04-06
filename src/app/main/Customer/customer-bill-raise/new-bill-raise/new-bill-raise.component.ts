import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomerBillRaiseService } from '../customer-bill-raise.service';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-new-bill-raise',
  templateUrl: './new-bill-raise.component.html',
  styleUrls: ['./new-bill-raise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewBillRaiseComponent implements OnInit {

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;
  vInvoiceNo:any;
  vCustomerId:any;
  vAmount:any;
  vInvoiceRaisedId:any;
  
  constructor(
    public _CustomerBill: CustomerBillRaiseService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private elementRef: ElementRef,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewBillRaiseComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  focusNext(nextElementId: string): void {
    const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }
  Savebtn:boolean=false;
  onSubmit(){
    if ((this.vInvoiceNo == '' || this.vInvoiceNo == null || this.vInvoiceNo == undefined)) {
      this.toastr.warning('Please enter a InvoiceNo', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
  if ((this.vCustomerId == '' || this.vCustomerId == null || this.vCustomerId == undefined)) {
    this.toastr.warning('Please enter a CustomerId', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
}
if ((this.vAmount == '' || this.vAmount == null || this.vAmount == undefined)) {
  this.toastr.warning('Please enter a Amount', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
  });
  return;
}
  if ((this.vInvoiceRaisedId == '' || this.vInvoiceRaisedId == null || this.vInvoiceRaisedId == undefined)) {
    this.toastr.warning('Please enter a InvoiceRaisedId', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  this.Savebtn = true;
  let customerInvoiceRaiseInsert = {};
  customerInvoiceRaiseInsert['invNumber'] = this._CustomerBill.myform.get('InvoiceNo').value || 0;
  customerInvoiceRaiseInsert['invDate'] = this._CustomerBill.myform.get('InvoiceDate').value || '';
  customerInvoiceRaiseInsert['customerId'] = this._CustomerBill.myform.get('CustomerId').value || '';
  customerInvoiceRaiseInsert['amount'] = this._CustomerBill.myform.get('Amount').value || 0;
  customerInvoiceRaiseInsert['invoiceRaisedId'] = this._CustomerBill.myform.get('InvoiceRaisedId').value;
  customerInvoiceRaiseInsert['createdBy'] = this._loggedService.currentUserValue.user.id || 0;


  let submitData = {
    "customerInvoiceRaiseInsert": customerInvoiceRaiseInsert,
  };
  console.log(submitData);
  this._CustomerBill.SaveCustomerBill(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); this._matDialog.closeAll();
      this.Savebtn = false;
    }
    else {
      this.toastr.error('New Custome Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }

  }, error => {
    this.toastr.error('New Custome Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });
  }
  onReset(){
    this._CustomerBill.myform.reset(); 
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
