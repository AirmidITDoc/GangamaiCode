import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MrdService {

  
  Otserachform:FormGroup;
  icdForm:FormGroup;
  otreservationFormGroup:FormGroup;
  MedicalForm:FormGroup;
  
  constructor(private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
      // this.Otserachform= this.filterForm();
      this.Otserachform=this.filterForm();
      this.icdForm=this.createIcdForm();
      this.MedicalForm=this.createMedicalForm();
      // this.otreservationFormGroup = this.createOtreservationForm();
     }
 

    filterForm(): FormGroup {
      return this._formBuilder.group({
  
        OTTableID:'',
        // DoctorName:'',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()]
  
      });
    }
    
    createIcdForm(): FormGroup {
      return this._formBuilder.group({
          F_Name: [""],
          L_Name: [""],
          M_Name: [""],
          IpdNo: [""],
          MobileNo: [""],
          RegNo: [""],
          RegID: [""],
          IPOP_Type: [""],
          WardName: [""],
          DOA: [""],
          DOD: [""],
          start: [(new Date()).toISOString()],
          end: [(new Date()).toISOString()],
          uhidNo:'',
          ICDCodeNameSearch:'',
          ICDCodeSearch:'',
      });
  }

  createMedicalForm() {
    return this._formBuilder.group({
      MedicalDate: [new Date().toISOString()],
      MedicalTime: [new Date().toISOString()],
      OP_IP_ID: '',
      OP_IP_Type: '',    
      RegID: '',
      PatientType: ['OP'],
      MLCNo:'',
      NameAuthority:'',
      BuckleNo:'',
      PoliceStation:'',
      Departmentid:'',
      DoctorId:'',
      DoctorId1:'',
      DoctorId2:'',
      CertificateNo:'',
      AccidentDateTime:'',
      AgeInjuries:'',
      CauseInjuries:'',
      vAccidentDetails:'',
    });
  }

  public icdInsert(employee, loader = true) {
    // if(loader){
    //   this.loaderService.show();
    // }
    return this._httpClient.post("MRD/InsertPatICDCode", employee);
  }

  public icdUpdate(employee, loader = true) {
    // if(loader){
    //   this.loaderService.show();
    // }
    return this._httpClient.post("MRD/UpdatePatICDCode", employee);
  }

  public getPatienticdList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_PatientICDList", employee)
  }

  // icdcode list
  public geticdCodelist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_M_ICDCdeMst_by_Name", employee)
  }
 // ip
 public getAdmittedPatientList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
}
// op
public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
}
  public getdischargepatientcasepaper(employee){
    return this._httpClient.post("Generic/GetByProc?procName=rptDischargePatientListforMRD", employee)
  }

  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=rptListofRegistration", employee)
  }
  
  public getCharitypatientList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CharityPatientList",employee)
  }

  public MrdcasepaperInsert(employee) {
    return this._httpClient.post("InPatient/MrdMedicalcasepaperInsert", employee)
  }

  public MrdcasepaperUpdate(employee) {
    return this._httpClient.post("InPatient/MrdMedicalcasepaperUpdate", employee)
  }

  public DeathcertificateInsert(employee){
    return this._httpClient.post("InPatient/MrdDeathcertificateInsert", employee)
  }

  public getAdmittedDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
   //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }

  //Doctor Master Combobox List
  public getDoctorMasterCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", param)
}

public getDoctorMaster() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
}
public getDoctorMaster1Combo() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrieveDoctorMasterForCombo", {})
}

  public populateFormpersonal(employee){
    this.otreservationFormGroup.patchValue(employee);
  }

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
}
