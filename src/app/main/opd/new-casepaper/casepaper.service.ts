import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { Observable, of } from 'rxjs';

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
}//m_Rtrv_PathRadServiceList"
 return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServicesList", param)
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
  public getDoseList( loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
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
  public SavePrescriptionTemplate(param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("InPatient/Insert-PrescriptionTemplate", param);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query, {})
  }
  public getOPDPrecriptionPrint(PrecriptionId, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPrecriptionPrint ", PrecriptionId)
  }
  public RtrvPreviousprescriptionDetails(visistId,loader = true) {
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=Get_PrescriptionDetailsVisitWise",visistId);
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

  public getItemlist(Param, loader = true) {//m_Rtrv_ItemName_BalanceQty  m_Rtrv_ItemName_ForPrescription
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemName_ForPrescription",Param)
  }
  public getPatientVisitedListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }

  public getIpPrescriptionview(OP_IP_ID,PatientType, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.get("InPatient/view-IP_Prescription?OP_IP_ID=" + OP_IP_ID+"&PatientType="+PatientType);
  }
  public getOpPrescriptionview(VisitId,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OutPatient/view-OP_Prescription?VisitId=" + VisitId);
  }

  
  public getOpPrescriptionwithoutheaderview(VisitId,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("OutPatient/view-OP_PrescriptionwithoutHeader?VisitId=" + VisitId);
  }
  public UpdateDoseName(data) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query="+data, {});
  }

  public getRtrvVisitedList(param, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_GetVisitInfo",param)
  } 
  public getitemgenericMasterCombo( loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemGenericNameMasterForCombo",{})
  } 
  public getcheifcomplaintList(param ) { 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OPCasepaperDignosisMaster",param)
  } 
  public getTemplateList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvPresTemplateName_List", {})
  }
  public getTempPrescriptionList(param, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvTemplate_PrescriptionList",param)
  } 
  public getRtrvTestService(visistId,loader = true) {
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OPRequestList",visistId);
  }
  public getvitalInfo(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query=" + query,{})
  }
  public getRtrvCheifComplaintList(visistId,loader = true) {
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OPCasepaperDignosisList",visistId);
  }
} 