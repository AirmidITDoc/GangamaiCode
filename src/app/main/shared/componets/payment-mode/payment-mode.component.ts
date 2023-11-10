import { Component, OnInit } from '@angular/core';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {
  isLoading: String = '';
  constructor(
    public _RequestforlabtestService: RequestforlabtestService
  ) { }

  ngOnInit(): void {
    this.initPayment();
  }

  initPayment() {
    this.isLoading = 'init-payment';
    let req = {
      "TransactionNumber":"2234567890",   
      "SequenceNumber": 1,                            
      "AllowedPaymentMode": "1",                              
      "MerchantStorePosCode": "1221258270",
      "Amount": "1",                          
      "UserID": "",          
      "MerchantID": '29610' ,                                
      "SecurityToken": "a4c9741b-2889-47b8-be2f-ba42081a246e",
      "IMEI": "TEST1001270",
      "AutoCancelDurationInMinutes": 5
    };
    this._RequestforlabtestService.payOnline(req).subscribe(resData => {
      console.log(resData);
      this.isLoading = '';
      
    });
  }

  status() {
    let req = {

      "MerchantID": "29610",
      "SecurityToken":"a4c9741b-2889-47b8-be2f-ba42081a246e",
      "IMEI":"TEST1001270",
      "MerchantStorePosCode":"1221258270",
      "PlutusTransactionReferenceID": 376395     
                                                    
    }
    this._RequestforlabtestService.payOnline(req).subscribe(resData => {
      console.log(resData);
      this.isLoading = '';
      
    });
  }

}
