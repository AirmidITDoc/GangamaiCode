import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LabCancellationService {

  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private accountService: AuthenticationService,
  ) { }

  createUserFormGroup() {
    return this._formBuilder.group({
      FirstName: [''],
      LastName: [''],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      PBillNo: '',
      RegNo: '',
      CompanyId: 0,
      UnitId: [this.accountService.currentUserValue.user.unitId]
      //  ReceiptNo: '',
    });
  }

  myFilterrefundbrowseform(): FormGroup {
    return this._formBuilder.group({

      FirstName: [''],
      LastName: [''],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      PBillNo: '',
      RegNo: '',
      RefundNo: '',
      CompanyId: 0,
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }

  public LabCancelBill(param) {
    return this._httpClient.PutData("BillCancellation/LabBillCancel", param)
  }
}
