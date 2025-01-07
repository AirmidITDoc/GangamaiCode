import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DoctornoteService {
  myform: FormGroup;
  constructor(public _httpClient: HttpClient,
    public _formBuilder: FormBuilder) {
      this.myform = this.createtemplateForm();
     }

     createtemplateForm(): FormGroup {
      return this._formBuilder.group({
      TemplateName: [''], 
      Description:[''], 
      HandOverType:['0'],
      RegID:[''],
      DoctNoteId:['']
      });
    }
  
  public DoctorNoteInsert(employee) {
    return this._httpClient.post("Nursing/SaveTDoctorsNotes", employee)
  }
  public DoctorNoteUpdate(employee) {
    return this._httpClient.post("Nursing/UpdateTDoctorsNotes", employee)
  }

  public getDoctorNoteCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorNotesTemplateMaterForCombo", {})
  }
  public getWardNameList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_WardClassMasterForCombo", {})
  }
  // ip
  public getAdmittedPatientList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getDoctorNotelist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_DoctorsNotesList ", employee)
  }

  DoctorNotepoppulateForm(param){
    this.myform.patchValue(param)
  }
}
