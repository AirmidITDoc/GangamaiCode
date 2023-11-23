import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentModeComponent implements OnInit {
  isLoading: String = '';
  heading: String = 'Please wait...';
  statusStr: String = 'Please do not close window or tab, your payment is in process';
  paymentRetryCout: number = 0;
  isRetryOrClose: String = '';
  constructor(
    public _RequestforlabtestService: RequestforlabtestService,
    private dialogRef: MatDialogRef<PaymentModeComponent>
  ) { }

  ngOnInit(): void {
    this.initPayment();
  }

  initPayment() {
    if(this.paymentRetryCout >= 3) {
      this.isLoading = '';
      this.isRetryOrClose = 'close';
      this.heading = 'Sorry.! Attempt Exhausted !!';
      this.statusStr = 'You reach maximum number of attempt, please try in sometime.';
      return;
    }
    this.isLoading = 'init-payment';
    this.heading = 'Please wait...';
    this.statusStr = 'Please do not close window or tab, your payment is in process';
    let req = {
      "TransactionNumber": "2234567890",
      "SequenceNumber": 1,
      "AllowedPaymentMode": "1",
      "MerchantStorePosCode": "1221258270",
      "Amount": "1",
      "UserID": "",
      "MerchantID": '29610',
      "SecurityToken": "a4c9741b-2889-47b8-be2f-ba42081a246e",
      "IMEI": "TEST1001270",
      "AutoCancelDurationInMinutes": 5
    };
    ++this.paymentRetryCout;
    this.isRetryOrClose = '';
    this._RequestforlabtestService.sendPaymentDetails(req).subscribe((resData: any) => {
      console.log(resData);
      this.isLoading = '';
      if (resData && resData.ResponseCode === 0 && resData.ResponseMessage.toString().toUpparCase() === 'APPROVED') {
        this.heading = 'Thank You...';
        this.statusStr = 'Your transaction is Sucessful.!';
        return;
      }
      if (resData && resData.ResponseCode === 1 && resData.ResponseMessage.toString().toUpperCase().includes('INVALID MERCHANT')) {
        this.heading = 'Something not right';
        this.isRetryOrClose = 'retry';
        this.statusStr = 'Please check the details and retry the Payment';
        return;
      }

    }, error => {
      this.isLoading = '';
      this.isRetryOrClose = 'retry';
      this.heading = 'Something not right';
      this.statusStr = 'Please try again';

    });
    // this._RequestforlabtestService.payOnline(req).subscribe(resData => {


    // });
  }

  status() {
    let req = {

      "MerchantID": "29610",
      "SecurityToken": "a4c9741b-2889-47b8-be2f-ba42081a246e",
      "IMEI": "TEST1001270",
      "MerchantStorePosCode": "1221258270",
      "PlutusTransactionReferenceID": 376395

    }
    // this._RequestforlabtestService.payOnline(req).subscribe(resData => {
    //   console.log(resData);
    //   this.isLoading = '';

    // });
  }

}
