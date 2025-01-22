import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    public _frombuilder: FormBuilder,
    public _httpClient: HttpClient,
        public loaderService:LoaderService
  ) { 
    this.myform = this.CreateMyform();
    this.myformSearch = this.createSearchForm();
  }

  CreateMyform() {
    return this._frombuilder.group({
      RegID: [''],
      PatientType: ['OP'],
      MobileNo: '',
      PatientName: '',
      ConsentName: '',
      ConsentText: [''],
      Template: [''],
      Department: [''],
      Language: ['1'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    })
  }

  createSearchForm() {
    return this._frombuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      IsIPOrOP:['2'],
      consentNameSearch:[''],
      uhidNo:['']
    })
  }

  // ip
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  // op
  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  //Deartment Combobox List
  public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }
  //template list
  public getTemplateMasterCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ConsentMasterList", param)
  }

  public getConsentPatientlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ConsentpatientInformation_List", employee)
  }
  public getConsentPatientInfoDetaillist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ConsentpatientInformationDemo_List",Param)
  }
  public NursingConsentInsert(employee, loader = true) {
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("OutPatient/TConsentInformationSave", employee);
  }

  public NursingConsentUpdate(employee, loader = true) {
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.post("OutPatient/TConsentInformationUpdate", employee);
  }
  public getConsentReportview(ConsentId, loader = true) {
    if(loader){
      this.loaderService.show();
    }
    return this._httpClient.get("OT/view-TConsentInformation?ConsentId=" + ConsentId);
  }
}
