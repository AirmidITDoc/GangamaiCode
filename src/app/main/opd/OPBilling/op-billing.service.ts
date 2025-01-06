import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OpBillingService {

  constructor(  public _httpClient:HttpClient,
    private _formBuilder: UntypedFormBuilder) { }

  public getOpPaymentview(PaymentId){
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }
}
