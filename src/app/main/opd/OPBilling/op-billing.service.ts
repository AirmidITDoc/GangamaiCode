import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class OpBillingService {

  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService
  ) { }

  public getOpPaymentview(PaymentId) {
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }
  // Insert add Charges 
  public InsertIPAddCharges(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("InPatient/InsertIPDPackageBill", employee);
  }
  // edit  main  Charges 
  public UpdateMainCharge(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
    }
    return this._httpClient.post("InPatient/UpdateIPDPackageCharges", employee);
  }
}
