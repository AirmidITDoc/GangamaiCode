import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPReportService {
  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        DoctorId:'',
        AdmissionID:'',
        AdvanceDetailID:'',
        RequestId:'',
        PaymentId:'',
        MaterialConsumptionId:''
        // Radio:['1']

      })
    }
  public getDataByQuery(emp) {
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
  }

  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
  }

  public getDoctorList(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo",{})
  }
 
  
public getAdmittedPatientListView(FromDate,ToDate,DoctorId,WardId){
  
  return this._httpClient.get("InPatient/view-Admitted_PatientList?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&WardId="+WardId);
}

public getAdmittedPatientCasepaaperView(AdmissionId){
  
  return this._httpClient.get("InPatient/view-Admitted_PatientCasepaper?AdmissionId=" + AdmissionId);
}


public getViewAdvanceReceipt(AdvanceDetailID){
 return this._httpClient.get("InPatient/view-IP-AdvanceReceipt?AdvanceDetailID=" + AdvanceDetailID);
}

public getLabrequestview(RequestId){
  return this._httpClient.get("InPatient/view-IP-Labrequest?RequestId=" + RequestId);
}

  
public getIpPaymentReceiptView(PaymentId){
  
  return this._httpClient.get("InPatient/view-IP-SettlementReceipt?PaymentId=" + PaymentId);
}

getMaterialconsumptionView(MaterialConsumptionId){
  
  return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId=" + MaterialConsumptionId);
}
}