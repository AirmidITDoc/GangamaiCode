import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IndentService {

  userFormGroup: FormGroup;
  IndentSearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.IndentSearchGroup= this.IndentSearchFrom();
  }

  IndentSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      Status: 0,
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
 
  public getIndentID(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Indent_by_ID",Param);
  }


  public getIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IndentItemList",Param);
  }
  
  public getIndentNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RtrvItemName_Indent",Param);
  }

  // public getStoreFromList(){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  // }

  public getFromStoreNameSearch(Params){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Params);
  }
  
  
  public getToStoreNameSearch(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }
}
