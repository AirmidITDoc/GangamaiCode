import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnInPatientService {
 
  constructor(
    public _httpClient1: ApiCaller,
  ) { }



  public getSalesReturnitemlist(param) {
    return this._httpClient1.PostData("Common", param)
  }
  public InsertCreditSalesReturn(employee) {
    return this._httpClient1.PostData("SalesReturn/SalesReturnWithCredit", employee)
  }

  public InsertCashSalesReturn(employee) {
    return this._httpClient1.PostData("SalesReturn/SalesReturnWithCash", employee)
  }

  public getReportView(Param) {
    return this._httpClient1.PostData("Report/ViewReport", Param);
  }
}



