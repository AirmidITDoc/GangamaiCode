import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  myform:FormGroup;

  constructor(
    public _frombuilder : FormBuilder,
    public _httpClient : HttpClient
  ) 
  {this.myform = this.CreateMyform() }

  CreateMyform(){
    return this._frombuilder.group({
      RegID:[''],
      PatientType:['OP'],
      MobileNo:'',
      PatientName:'',
      TemplateDesc:[''],
      Template:[''],
      Department:[''],
      Language:['0']
    })
  }

    // ip
    public getAdmittedPatientList(employee){
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
}
