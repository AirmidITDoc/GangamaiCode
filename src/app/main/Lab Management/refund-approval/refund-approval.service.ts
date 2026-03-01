import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefundApprovalService {

  myformSearch: FormGroup;
  sampldetailform: FormGroup;

  constructor(private _formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
     private _httpClient: ApiCaller) {
    this.myformSearch = this.createSearchForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: [],
      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      // BillNo:[''],
      // BillDate:[''],
      PatientTypeSearch: ['5'],
      StatusSearch: ['2'],
      Istype: ['2'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      PBillNo: '',
      CompanyId: 0,
      UnitId: [this.accountService.currentUserValue.user.unitId]
    });
  }

  CreateForm() {
    return this._formBuilder.group({
      refundId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isApproval: [false],
      approvedBy: this.accountService.currentUserValue.userId,
      approvalDatetime: [new Date().toISOString()],
      comment: ['', [Validators.required]],
    })
  }

  public statusUpdate(Param: any) {
    return this._httpClient.PutData("RefundOfBill/UpdateRefundApproval" + Param.refundId, Param);
  }
}
