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
      Note: [''], 
      Description:[''],
      WardName:[''],
      HandOverType:['0']
      });
    }
  
  public DoctorNoteInsert(employee) {
    return this._httpClient.post("InPatient/DoctorNoteInsert", employee)
  }

  public getDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
}
