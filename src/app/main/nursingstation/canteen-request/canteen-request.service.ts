import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CanteenRequestService {
  MyForm:FormGroup;
  SearchMyForm:FormGroup;
  
  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { this.MyForm = this.createMyForm(),
     this.SearchMyForm = this.createsearchForm() 
   }

   createMyForm(){
      return this._formbuilder.group({
        
       // FromDate:[new Date()],
       // ToDate:[new Date()],
      })
    }
    createsearchForm(){
      return this._formbuilder.group({
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()],
        RegNo:['']
      })
    }

    public getCanteenList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestListFromWard",Param);
    }
    public getCanteenDetList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestDet",Param);
    }
}
