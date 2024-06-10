import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SMSConfugurationService {

  MySearchForm:FormGroup;
  MyNewSMSForm:FormGroup;

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  ) 
  {
    this.MySearchForm = this.CreateSearchForm();
    this.MyNewSMSForm = this.CreateSMSForm();
   }
   CreateSearchForm(){
    return this._formbuilder.group({
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()]
    });
   }
   CreateSMSForm(){
    return this._formbuilder.group({
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      TemplateCreation:[''],
      Msgcategory:[''],
      Message:['']
    });
   }
   public getSMSSentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestDet",Param);
  }
}
