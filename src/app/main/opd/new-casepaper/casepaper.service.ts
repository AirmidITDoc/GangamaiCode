import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CasepaperService {

  constructor(public _httpClient: HttpClient,
    private _loaderService: LoaderService,
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
 //Deartment Combobox List
 public getDepartmentCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
} 
//Deartment Combobox List
public getServiceList(param,loader = true){ 
  if (loader) {
    this._loaderService.show();
}
 return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathRadServiceList", param)
}
  //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", { "Id": Id })
  }
    // Admitted Doctor Master Combobox List
    public getAdmittedDoctorCombo(param, loader = true) {
      if (loader) {
        this._loaderService.show();
    }
  
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo",param)
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

  public onSaveCasepaper(param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("OutPatient/PrescriptionInsert", param);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public getOPDPrecriptionPrint(PrecriptionId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }
  public RtrvPreviousprescriptionDetails(visistId,loader = true) {
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise", { "VisitId": visistId });
  }
  public getVisitedList(employee,loader = true) {
    if(loader){
      this._loaderService.show();
    }

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
  public getOpPrescriptionview(VisitId,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OutPatient/view-OP_Prescription?VisitId=" + VisitId);
  }
  
}
