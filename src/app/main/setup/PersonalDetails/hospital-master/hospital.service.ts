import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
HospitalForm:FormGroup;
myformSearch:FormGroup;
  constructor(  private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
      this.HospitalForm = this.createHospitalForm();
      this.myformSearch = this.createSearchForm();
     }


  createHospitalForm():FormGroup{
    return this._formBuilder.group({
      HospitalName: [""],
      HospitalAddress: [""],
      City:[""],
      CityId:[""],
      Pin:["",Validators.pattern("[0-9]{7}")],
      Phone: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Email:[""],
      website:[""],
      HospitalId:[""],
      HospitalHeader:[""]
    });
}


createSearchForm():FormGroup{
  return this._formBuilder.group({
    NameSearch:[""],
      IsDeletedSearch: ["1"],
  });
}

public HospitalInsert(param) {
  return this._httpClient.post("PersonalDetails/HospitalSave", param);
}

public HospitalUpdate(param) {
  return this._httpClient.post("PersonalDetails/HospitalUpdate", param);
}
public getCityList() {

  return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
}
public getHospitalMasterList() {
      
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_HospitalMaster", {})
}
populateForm(param) {
  this.HospitalForm.patchValue(param);
}
}
