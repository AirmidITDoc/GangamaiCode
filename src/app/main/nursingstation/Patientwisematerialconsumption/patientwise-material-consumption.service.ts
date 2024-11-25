import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PatientwiseMaterialConsumptionService {

  constructor(public _httpClient: HttpClient,public _httpClient1: ApiCaller,
    public _formBuilder: FormBuilder) { }

  
  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList", employee)
  }
  public getpatientwisematerialconsumptionList(employee) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Admtd_Ptnt_Dtls", employee)
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatMaterialConsumption_ByName", employee)
  }

  public getStoreCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_StoreMast_List_1", {})
  }

  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }

  public MaterialConsumptionSave(employee){
    return this._httpClient.post("InPatient/MaterialConsumption", employee);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("PhoneApp", m_data);
  }
}
