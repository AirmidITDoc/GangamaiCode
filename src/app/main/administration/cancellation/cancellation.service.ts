import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  UserFormGroup: UntypedFormGroup;
  MyForm: UntypedFormGroup;
  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: HttpClient
  ) { this.UserFormGroup = this.createUserFormGroup() }

  createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '',
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
  public getDateTimeChange(m_data) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}
}
