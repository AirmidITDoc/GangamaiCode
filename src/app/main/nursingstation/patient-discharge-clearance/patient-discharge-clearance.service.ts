import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PatientDischargeClearanceService {

  myForm:FormGroup;

  constructor(
    private _httpClient:HttpClient,
    private _formbuilder:FormBuilder,
    private _loaderService:LoaderService
  ) { }

  public getClearancelist(loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientClearanceList", {})
  }
  
  public getapprovelist(param,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientClearanceApprovalList", param)
  }

}
