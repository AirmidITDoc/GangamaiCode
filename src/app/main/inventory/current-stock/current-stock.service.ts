import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CurrentStockService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.SearchGroup= this.createSearchFrom();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      StoreId:'',
      ItemCategory:'',
      IsDeleted:['2']
    });
  }
  
    IndentID() {
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
 
  public getCurrentStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Storewise_CurrentStock",Param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
}
