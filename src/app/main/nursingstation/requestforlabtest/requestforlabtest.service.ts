import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RequestforlabtestService {
  myFormGroup: any;
  

  constructor(
    public _httpClient:HttpClient,
    private _FormBuilder:FormBuilder,
  ) { this.mySearchForm = this.SearchFilterForm();}

  mySearchForm:FormGroup;

  SearchFilterForm():FormGroup{
    return this._FormBuilder.group({
      startdate :[(new Date()).toISOString()],
      enddate :[(new Date()).toISOString()],
      RegNo :''
    })

  }

  public getRequesttList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing",Param)
  }

  public getRequestdetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_NursingLabRequestDetails",Param)
  }
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientAdmittedListSearch", employee)
  }
  public getServiceList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList",Param)
  }
  public LabRequestSave(employee) {
    return this._httpClient.post("InPatient/IPPathOrRadiRequest", employee);
  }

  // paymentBaseUrl = 'https://www.plutuscloudserviceuat.in:8201/API/CloudBasedIntegration/V1';

  // public payOnline(req) {
  //   return this._httpClient.post(this.paymentBaseUrl + "/UploadBilledTransaction", req);
  // }
 
}
