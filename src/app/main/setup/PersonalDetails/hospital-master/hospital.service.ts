import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
      Pin:[""],
      Phone:[""],
      Email:[""],
      website:[""]

    
    });
}


createSearchForm():FormGroup{
  return this._formBuilder.group({
    NameSearch:[""],
      IsDeletedSearch: ["1"],
  });
}



public getHospitalMasterList() {
      
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_HospitalMaster", {})
}
}
