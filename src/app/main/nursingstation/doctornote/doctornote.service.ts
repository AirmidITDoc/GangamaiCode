import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DoctornoteService {
  myform: UntypedFormGroup;
  constructor(public _httpClient: HttpClient,
    public _formBuilder: UntypedFormBuilder) {
      this.myform = this.createtemplateForm();
     }

     createtemplateForm(): UntypedFormGroup {
      return this._formBuilder.group({
      Note: [''], 
      Description:[''],
      WardName:[''],
      HandOverType:['0']
      });
    }
  
  public DoctorNoteInsert(employee) {
    return this._httpClient.post("InPatient/DoctorNoteInsert", employee)
  }

  public getDoctorNoteCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorNotesTemplateMaterForCombo", {})
  }
  public getWardNameList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_WardClassMasterForCombo", {})
  }
}
