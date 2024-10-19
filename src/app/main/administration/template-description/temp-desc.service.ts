import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TempDescService {

  constructor( public _formBuilder: FormBuilder,
    public _httpClient: HttpClient) { }


  
public templateInsert(param) {
  return this._httpClient.post("PersonalDetails/HospitalSave", param);
}

public TemplateUpdate(param) {
  return this._httpClient.post("PersonalDetails/HospitalUpdate", param);
}

public getTemplateList() {
      
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ReportTemplateConfig", {})
}
populateForm(param) {
  //this.HospitalForm.patchValue(param);
}
}
