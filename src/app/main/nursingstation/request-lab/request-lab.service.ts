import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RequestLabService {

  userFormGroup: FormGroup;
  RequestLabSearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.RequestLabList();
    this.RequestLabSearchGroup= this.RequestLabSearchFrom();
  }

  RequestLabSearchFrom() {
    return this._formBuilder.group({
      RegNoSearch: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }

  RequestLabList() {
    return this._formBuilder.group({
      RoleId: '',
      RoleName: '',
      AdmDate:'',
      Date:'',
      StoreName:'',
      PreNo:'',
      IsActive: '',
      
    });
  }
 
  public getRequestLabList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_LabRequest_Nursing",Param);
  }


  public getRequestLabDetails(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_NursingLabRequestDetails",Param);
  }
  
}
