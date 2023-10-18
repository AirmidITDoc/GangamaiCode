import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionReturnService {

  constructor(
    public _httpClient:HttpClient,
    private _FormBuilder:FormBuilder
  ) { this.mySearchForm=this.SearchFilterForm();}

  mySearchForm:FormGroup;

  SearchFilterForm():FormGroup{
    return this._FormBuilder.group({
      startdate:[(new Date()).toISOString],
      enddate:[(new Date()).toISOString],
      RegNo:''
    })
  }


  public getPriscriptionretList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPrescriptionReturnListFromWard",Param)
  }

  public getPreiscriptionretdetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IPPrescReturnItemDet",Param)
  }
}


 


 
 
 