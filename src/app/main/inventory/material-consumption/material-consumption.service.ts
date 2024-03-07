import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MaterialConsumptionService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.createUserForm();
    this.SearchGroup= this.createSearchFrom();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      StoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      FromStoreId: '',
      BatchNO: '',
      ItemName:'',
      BalQty:'',
      UsedQty:'',
      Rate:'',
      Remark: '',
      ItemID:''
      
    });
  }
 
 


  // public getIndentList(Param){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IndentItemList",Param);
  // }

  // public getStoreFromList(){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  // }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getMaterialConList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_MaterialConsumption_ByName",Param);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemName_BalQty_M",Param)
  }
  
}
