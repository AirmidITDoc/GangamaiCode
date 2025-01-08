import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadChildren } from '@angular/router';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class NursingnoteService {
  myform: FormGroup;
  PatientHandOverForm:FormGroup

  constructor(public _httpClient: HttpClient,
    public _formBuilder: FormBuilder,
    private _loaderService:LoaderService
  ) {
      this.myform = this.createtemplateForm();
      this.PatientHandOverForm = this.CreateHandOverForm();
     }

     
  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateName: [''], 
      Description:[''], 
      RegID:[''],
      NursingNoteId:['']
    });
  }
  CreateHandOverForm(): FormGroup {
    return this._formBuilder.group({
      HandOverType: ['0'], 
      staffName:[''] 
    });
  }


  public NursingNoteInsert(employee) {
    return this._httpClient.post("Nursing/SaveTNursingNotes", employee)
  }
  public NursingNoteUpdate(employee) {
    return this._httpClient.post("Nursing/UpdateTNursingNotes", employee)
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
  // ip
  public getAdmittedPatientList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getNursingNoteCombo(){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_NursingNotesTemplateMaterForCombo ", {})
  }
  public getItemlist(Param, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemName_BalanceQty",Param)
  }
  public getDoseList( loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_DoseMasterList", {})
  }










  
  NursingNotepoppulateForm(param){
    this.myform.patchValue(param)
  }
}
