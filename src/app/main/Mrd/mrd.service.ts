import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MrdService {

  
  Otserachform:UntypedFormGroup;
  otreservationFormGroup:UntypedFormGroup;
  
  constructor(private _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder) {
      // this.Otserachform= this.filterForm();
      this.Otserachform=this.filterForm();
      // this.otreservationFormGroup = this.createOtreservationForm();
     }
 

    filterForm(): UntypedFormGroup {
      return this._formBuilder.group({
  
        OTTableID:'',
        // DoctorName:'',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()]
  
      });
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
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
  }

  public getDoctorMaster() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo", {})
  }

  public getDoctorMaster1(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorMasterForCombo", {})
  }

  public populateFormpersonal(employee){
    this.otreservationFormGroup.patchValue(employee);
  }

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
}
