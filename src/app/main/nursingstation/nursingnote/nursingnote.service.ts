import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NursingnoteService {
  myform: FormGroup;
  constructor(public _httpClient: HttpClient,
    public _formBuilder: FormBuilder) {
      this.myform = this.createtemplateForm();
     }

     
  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      Note: [''], 
      Description:[''],
      Op_ip_id:['1'],
      RegID:['']
    });
  }


  public DoctorNoteInsert(employee) {
    return this._httpClient.post("InPatient/DoctorNoteInsert", employee)
  }
  public getDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingNotesTemplateMaterForCombo", {})
  }
  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getNoteList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingNotesTemplateMaterForCombo", {})
  }
  public getNursingNotelist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingNotesList ", employee)
  }
}
