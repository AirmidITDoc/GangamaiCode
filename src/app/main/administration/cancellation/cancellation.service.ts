import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  UserFormGroup: FormGroup;
  constructor(
    public _formBuilder: FormBuilder,
    public _httpClient: HttpClient
  ) { this.UserFormGroup = this.createUserFormGroup() }

  createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      SalesNo: '',
      OP_IP_Type: ['1']

    })
  }
  public getIpBillList(param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseIPDBill", param) 
  }
  public getOPDBillsList(param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill_Pagi", param) 
  }
  public SaveCancelBill(param) {
    return this._httpClient.post("Administration/Billcancellation", param) 
  }
}
