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
  public getSalesList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesBillList", Param);
  }
}
