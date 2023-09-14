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
    return this._httpClient.post("OutPatient/CasePaperPrescriptionSave", param);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }
  public prescriptionDetails(visistId) {
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise", { "VisitId": visistId });
  }
  public getVisitedList(employee) {

    return this._httpClient.post("Generic/GetByProc?procName=rtrv_CaseparVisitDetails", employee)
  }
  // registration patient list
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList", employee)
  }
}
