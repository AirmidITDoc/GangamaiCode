import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CasepaperService {

  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder) { }

  public getcasepaperVisitDetails(visitId) {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails", { "VisitId": visitId });
  }

  public getHistoryList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_PastHistoryMasterForCombo", {})
  }

  public getDiagnosisList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ComplaintMasterForCombo", {})
  }

  public getDoseList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
  }

  public getDrugList(drugValue) {
    // return this._httpClient.post("Generic/GetByProc?procName=ps_RtvrDrugName", { "ItemName": drugValue })
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty", { "ItemName": drugValue })
    
  }
  public getComplaintList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ComplaintMasterForCombo", {});
  }

  public getExaminationList() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_M_ExaminationMasterForCombo", {});
  }

  public onSaveCasepaper(param) {
    return this._httpClient.post("OutPatient/PrescriptionInsert", param);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }
  public RtrvPreviousprescriptionDetails(visistId) {
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise", { "VisitId": visistId });
  }
  public getVisitedList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails", employee)
  }
  // registration patient list
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList", employee)
  }

  public getItemlist(Param){//m_Rtrv_IPDrugName,Retrieve_ItemName_BalanceQty
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
  }
  public getPatientVisitedListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }

  public getIpPrescriptionview(OP_IP_ID,PatientType){
    return this._httpClient.get("InPatient/view-IP_Prescription?OP_IP_ID=" + OP_IP_ID+"&PatientType="+PatientType);
  }
  public getOpPrescriptionview(VisitId){
    return this._httpClient.get("OutPatient/view-OP_Prescription?VisitId=" + VisitId);
  }
  
}
