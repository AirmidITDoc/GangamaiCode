import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  myDocShrformSearch: FormGroup;
  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder,
    public _loaderservice:LoaderService
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
  public getGSTRecalculate(emp ,loader = true) {
    if(loader){
      this._loaderservice.show();
    }
    return this._httpClient.post("Administration/InsertGSTReCalculProcess", emp)
  }
    //Hospital Combobox List
    public getHospitalCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=rtrv_UnitMaster_1", {})
    }
  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getUserList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList", employee)
  }
  // public ConfigSettingParamList() {
  //   // debugger;
  //   return this._httpClient.post(`Generic/GetByProc?procName=SS_ConfigSettingParam`, {})
  //   // console.log(this.configSettingParam);
  // };
  // public SchedulerParamList() {
  //   // debugger;
  //   return this._httpClient.post(`Generic/GetByProc?procName=ss_get_schedulerList`, {})

  // };
  // public ConfigUpdate(employee) {
  //   return this._httpClient.post("OutPatient/UpdateConfigSetting", employee);
  // }
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
    public getPathologistDoctorCombo(param) { //Retrieve_PathologistDoctorMasterForCombo
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", param)
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

    
    public getwebRoleCombobox() {
      return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_WebRoleList", {})
    }
     
    public UserInsert(employee) {
      return this._httpClient.post("Administration/InsertLoginUser", employee);
    }
    
    public UserUpdate(employee) {
      return this._httpClient.post("Administration/UpdateLoginUser", employee);
    }
    public getStoreList(){
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
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
