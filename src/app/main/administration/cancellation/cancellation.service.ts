import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  getIpdreturnAdvancepaymentreceipt(D_data: { F_Name: string; L_Name: string; From_Dt: string; To_Dt: string; Reg_No: any; }) {
      throw new Error('Method not implemented.');
  }
  UserFormGroup: FormGroup;
  MyForm: FormGroup;
  constructor(
    public _formBuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller
  ) { this.UserFormGroup = this.createUserFormGroup() }

  createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: '',
      LastName: '',
      PBillNo: '',
      OP_IP_Type: ['0']

    })
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
  public getIpBillList(param) {
    return this._httpClient.PostData("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseIPDBill", param) 
  }
  public getOPDBillsList(param) {
    return this._httpClient.PostData("Generic/GetDataSetByProc?procName=m_Rtrv_BrowseOPDBill_Pagi", param) 
  }
  public SaveCancelBill(param) {
    return this._httpClient.PostData("Administration/Billcancellation", param) 
  }
  public getDateTimeChange(m_data) {
    return this._httpClient.PostData("Generic/ExecByQueryStatement?query=" + m_data,{});
}
}
