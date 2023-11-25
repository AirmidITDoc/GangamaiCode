import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { Observable, Subscription, interval } from 'rxjs';
import { OnlinePaymentService } from '../../services/online-payment.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentModeComponent implements OnInit, OnDestroy {
  isLoading: String = '';
  heading: String = 'Please wait...';
  statusStr: String = 'Please do not close window or tab, your payment is in process';
  paymentRetryCout: number = 0;
  isRetryOrClose: String = '';
  PlutusTransactionReferenceID: number;

  poller: Subscription;

  autoCancelDuration = environment.AUTO_CANCEL_DURATION_MINUTES;

  cancelDurationMin = 4;
  cancelDurationSec = 59;
  statusApiInterval = 10000;
  isPaymentCancel: boolean = false;
  timoutPoller: any;

  constructor(
    public _RequestforlabtestService: RequestforlabtestService,
    private dialogRef: MatDialogRef<PaymentModeComponent>,
    private onlinePaymentService: OnlinePaymentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initPayment();
  }

  initPayment() {
    if (this.paymentRetryCout >= 3) {
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
      "TransactionNumber": Math.floor(Math.random() * 10000000000),
      "SequenceNumber": environment.SEQUENCE_NUMBER,
      "AllowedPaymentMode": environment.ALLOWED_PAYMENT_MODE,
      "MerchantStorePosCode": environment.MERCHANT_STORE_POS_CODE,
      "Amount": parseInt(this.data.finalAmount),
      "UserID": "",
      "MerchantID": environment.MERCHANT_ID,
      "SecurityToken": environment.SECURITY_TOKEN,
      "IMEI": environment.IMEI,
      "AutoCancelDurationInMinutes": this.autoCancelDuration
    };
    ++this.paymentRetryCout;
    this.isRetryOrClose = '';
    this._RequestforlabtestService.sendPaymentDetails(req).subscribe((resData: any) => {
      console.log(resData);
      this.isLoading = '';
      if (resData && resData.ResponseCode.toString() == '0' && resData.ResponseMessage.toString().toUpperCase() === 'APPROVED') {
        this.heading = 'Please wait for';
        this.statusStr = 'Your transaction sent to the Machine';
        this.isLoading = 'timer-start';
        this.PlutusTransactionReferenceID = resData.PlutusTransactionReferenceID;
        this.onlinePaymentService.PlutusTransactionReferenceID = resData.PlutusTransactionReferenceID;
        this.poller = interval(1000).subscribe(x => {
          this.cancelDurationSec = this.cancelDurationSec - 1;
          if (this.cancelDurationMin == 0 && this.cancelDurationSec == 0) {
            this.cancelDurationSec = 0;
            this.isLoading = 'timer-ends';
            this.isRetryOrClose = 'retry';
            this.heading = 'Time out.!';
            this.statusStr = 'You cross the time for payment, please try again.';
            this.poller.unsubscribe();
          } else if (this.cancelDurationSec == 0) {
            this.cancelDurationMin = this.cancelDurationMin - 1;
            this.cancelDurationSec = 60;
          }
        });

        this.getStatusOfPayment();
        return;
      }
      if (resData && resData.ResponseCode === 1 &&
        (resData.ResponseMessage.toString().toUpperCase().includes('INVALID MERCHANT') || resData.ResponseMessage.toString().toUpperCase().includes('PLEASE APPROVE OPEN TXN FIRST'))) {
        this.heading = 'Something not right';
        this.isRetryOrClose = 'retry';
        this.statusStr = resData.ResponseMessage; //'Please check the details and retry the Payment';
        return;
      }

    }, error => {
      this.isLoading = '';
      this.isRetryOrClose = 'retry';
      this.heading = 'Something not right';
      this.statusStr = 'Please try again';

    });
  }


  getStatusOfPayment() {
    let req = {
      "MerchantID": environment.MERCHANT_ID,
      "SecurityToken": environment.SECURITY_TOKEN,
      "IMEI": environment.IMEI,
      "MerchantStorePosCode": environment.MERCHANT_STORE_POS_CODE,
      "PlutusTransactionReferenceID": this.PlutusTransactionReferenceID
    };
    this.isRetryOrClose = '';
    this._RequestforlabtestService.getPaymentStatus(req).subscribe((resData: any) => {
      console.log(resData);
      if (resData && resData.ResponseCode && resData.ResponseCode === 1001) {
        this.timoutPoller = setTimeout(() => {
          if (this.cancelDurationMin > 0 && this.cancelDurationMin < 5 && !this.isPaymentCancel) {
            this.getStatusOfPayment();
          }
        }, this.statusApiInterval);

      } else if (resData && resData.ResponseCode.toString() == '0' && resData.ResponseMessage && resData.ResponseMessage == 'TXN APPROVED') {
        console.log('Sucsess.......');
        this.isLoading = 'payment-success';
        this.heading = 'Thank you.!';
        this.statusStr = 'Your payment is success, please Save the previous details.';
      }
      console.log(resData);
    }, error => {

      this.timoutPoller = setTimeout(() => {
        if (this.cancelDurationMin > 0 && this.cancelDurationMin < 5 && !this.isPaymentCancel) {
          this.getStatusOfPayment();
        }
      }, this.statusApiInterval);

    });
  }

  cancelPayment() {
    let req = {
      "MerchantID": environment.MERCHANT_ID,
      "SecurityToken": environment.SECURITY_TOKEN,
      "IMEI": environment.IMEI,
      "MerchantStorePosCode": environment.MERCHANT_STORE_POS_CODE,
      "PlutusTransactionReferenceID": this.PlutusTransactionReferenceID,
      "Amount": parseInt(this.data.finalAmount),
    };
    this._RequestforlabtestService.cancelPayment(req).subscribe((resData: any) => {
      if (resData && resData.ResponseCode.toString() == '0') {
        this.isPaymentCancel = true;
        this.poller.unsubscribe();
        clearTimeout(this.timoutPoller);
        this.dialogRef.close(false);
        this.toastrService.warning('', 'Your current payment was cancelled');
      }
    });
  }

  ngOnDestroy() {
    this.poller.unsubscribe();
  }

}
