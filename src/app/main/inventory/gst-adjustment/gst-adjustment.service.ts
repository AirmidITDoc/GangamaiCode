import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GstAdjustmentService {

  userFormGroup: UntypedFormGroup;
  IndentSearchGroup :UntypedFormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
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

  public getStoreFromList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getToList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",{});
  }
  
}
