import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CustomerInformationService } from '../customer-information.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerPaymentComponent implements OnInit {


  vAmount:any;
  registerObj:any;
  PaymentId:any;
  vCustomerName:any;
  vCustomerId:any;

  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<CustomerPaymentComponent>,
    private _loggedService: AuthenticationService,
    private _formbuilder : FormBuilder
  ) { }

  ngOnInit(): void {
   
    if(this.data){
      this.registerObj= this.data.Obj;
      console.log(this.registerObj)
      this.vCustomerName = this.registerObj.CustomerName;
      this.vAmount = this.registerObj.AMCAmount;
      this.vCustomerId = this.registerObj.CustomerId;
    }
  }




  onSubmit() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

    if ((this.vAmount == '' || this.vAmount == null || this.vAmount == undefined)) {
      this.toastr.warning('Please enter a Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
 
    if (!this.PaymentId) {
     let  customerPaymentInsertObj={
        "paymentId": 0,
        "paymentDate":this.datePipe.transform(this._CustomerInfo.PaymentForm.get('PayDate').value, 'dd/MM/YYYY') || '1/1/1999',
        "paymentTime": formattedTime,
        "customerId":  this.vCustomerId || 0,
        "amount": this._CustomerInfo.PaymentForm.get('Amount').value || 0,
        "comments":this._CustomerInfo.PaymentForm.get('Description').value || 0,
        "createdBy":this._loggedService.currentUserValue.user.id || 0,
        "createdByDateTime": formattedTime
      }

      let submitData = {
        "customerPaymentInsert": customerPaymentInsertObj
      };
      console.log(submitData);
      this._CustomerInfo.SaveCustomerPayment(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        }
        else {
          this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    } else { 
      let  customerPaymentUpdateObj={
        "paymentId": 0,
        "paymentDate":formattedDate,
        "paymentTime": formattedTime,
        "customerId": this.vCustomerId || 0,
        "amount": this._CustomerInfo.PaymentForm.get('Amount').value || 0,
        "comments":this._CustomerInfo.PaymentForm.get('Description').value || 0,
        "createdBy":this._loggedService.currentUserValue.user.id || 0 
      }
      
      let submitData = {
        "customerPaymentUpdate": customerPaymentUpdateObj,
      };

      console.log(submitData);
      this._CustomerInfo.UpdateCustomerBill(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        }
        else {
          this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
  }
  onClose(){
    this.dialogRef.close();
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
