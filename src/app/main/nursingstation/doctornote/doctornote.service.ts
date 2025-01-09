import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class DoctornoteService {
  myform: FormGroup;
  constructor(public _httpClient: HttpClient,
    public _formBuilder: FormBuilder,
    private _loaderService:LoaderService
  ) {
      this.myform = this.createtemplateForm();
     }

     createtemplateForm(): FormGroup {
      return this._formBuilder.group({
      TemplateName: [''], 
      Description:[''], 
      HandOverType:['Morning'],
      RegID:[''],
      DoctNoteId:[''],
      staffName:[''],
      SYMPTOMS:[''],
      Instruction:[''],
      Stable:[''],
      Assessment:[''],
      docHandId:['']
      });
    }
  
  public DoctorNoteInsert(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Nursing/SaveTDoctorsNotes", employee)
  }
  public DoctorNoteUpdate(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Nursing/UpdateTDoctorsNotes", employee)
  }
  public HandOverInsert(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Nursing/SaveTDoctorPatientHandover", employee)
  }
  public HandOverUpdate(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Nursing/UpdateTDoctorPatientHandover", employee)
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
  public getDoctorNotelist(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_DoctorsNotesList ", employee)
  }
  public getHandOverNotelist(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_T_Doctor_PatientHandoverList ", employee)
  }


  DoctorNotepoppulateForm(param){
    this.myform.patchValue(param)
  }
}
