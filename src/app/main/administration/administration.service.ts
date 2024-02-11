import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  myDocShrformSearch: FormGroup;
  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder,
    ) {
      this.myDocShrformSearch = this.BillListForDocShr();
     }


     
  BillListForDocShr(): FormGroup {
    return this._formBuilder.group({

      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      DoctorId: '',
      PBillNo: '',


    });
  }
  public getUserList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList", employee)
  }
  public ConfigSettingParamList() {
    // debugger;
    return this._httpClient.post(`Generic/GetByProc?procName=SS_ConfigSettingParam`, {})
    // console.log(this.configSettingParam);
  };
  public SchedulerParamList() {
    // debugger;
    return this._httpClient.post(`Generic/GetByProc?procName=ss_get_schedulerList`, {})

  };
  public ConfigUpdate(employee) {
    return this._httpClient.post("OutPatient/UpdateConfigSetting", employee);
  }
  public getOPDBillingCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCashCounterMasterForCombo", {})
  }
    //Patient Type Combobox List
    public getPatientTypeCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrievePatientTypeMasterForCombo", {})
    }
    public getPathDepartmentCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveDocDepartmentMasterForCombo", {})
    }
    public getPathologistDoctorCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologistDoctorMasterForCombo", {})
    }
    public getRoleCombobox() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoleMasterForCombo", {})
    }
    
    public getStoreCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForCombo", {})
    }
    public getDoctorMasterCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
    }
    
     
    public UserInsert(employee) {
      return this._httpClient.post("DoctorMaster/DoctorSave", employee);
    }
    
    public UserUpdate(employee) {
      return this._httpClient.post("DoctorMaster/DoctorUpdate", employee);
    }
    public getLoggedStoreList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
    }
     // Doctor Master Combobox List
  public getAdmittedDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
 //Doctor Share
 public getBillListForDocShrList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BillListForDocShr", employee)
}
}
