import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequisitionVerificationService {

  constructor(
    public _httpClient1: ApiCaller,
    private _FormBuilder: UntypedFormBuilder,
  ) { }

  SearchFilterForm(): FormGroup {
    return this._FormBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FromStoreId: [0],
      ToStoreId: [0],
      status: [0]
    })
  }
}
