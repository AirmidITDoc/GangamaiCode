import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RequestforlabtestService {
  myFormGroup: any;
  

  constructor(
    public _httpClient:HttpClient,
    private _FormBuilder:FormBuilder,
    private handler: HttpBackend
  ) { this.mySearchForm = this.SearchFilterForm();}

  mySearchForm:FormGroup;

  SearchFilterForm():FormGroup{
    return this._FormBuilder.group({
      startdate :[(new Date()).toISOString()],
      enddate :[(new Date()).toISOString()],
      RegNo :''
    })

  }
  public getPrintRequesttList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=rptLabRequestList",Param)
  }

  public getRequesttList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_LabRequest_Nursing",Param)
  }//Rtrv_LabRequest_Nursing

  public getRequestdetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingLabRequestDetails",Param)
  }
  
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }

  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }

  
  public getServiceListDetails(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList",Param);
  }

  public getRegistrationList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList",Param);
  }

 public Canclerequest(query){
  return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
 }


  public LabRequestSave(employee) {
    return this._httpClient.post("InPatient/IPPathOrRadiRequest", employee);
  }

  public sendPaymentDetails(emp){
    return this._httpClient.post("PaymentGetway/OnlinePayment",emp);
  }

  public getPaymentStatus(emp){
    return this._httpClient.post("PaymentGetway/OnlinePaymentStatus",emp);
  }

  public cancelPayment(emp){
    return this._httpClient.post("PaymentGetway/OnlinePaymentCancel",emp);
  }
 
  public getLabrequestview(RequestId){
    return this._httpClient.get("InPatient/view-IP-Labrequest?RequestId=" + RequestId);
  }
}


 