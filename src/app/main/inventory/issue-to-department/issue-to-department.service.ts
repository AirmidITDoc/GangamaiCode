import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IssueToDepartmentService {

  NewIssueGroup: FormGroup;
  IssueSearchGroup :FormGroup;
  

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.NewIssueGroup = this.getNewIssueForm();
    this.IssueSearchGroup= this.IssueSearchFrom();
  
  }

  IssueSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
     
    });
  }
  getNewIssueForm() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      ItemName:  [''],
      ItemID:[''],
      BatchNO:[''],
      BalanceQty:[''],
      Qty: [''],
      UnitRate:[''],
      TotalAmount:[''],
      Remark:[''],
      GSTAmount:[''],
      FinalTotalAmount:[''],
      Exp:[''],
      ExpDatess:['']
    });

  }

 
 
  public getIssueToDepList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IssueToDep_list_by_Name",Param);
  }

  public getIssueItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IssueItemList",Param);
  }
  
  public getToStoreSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForCombo",{});
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getItemlist(Param){//RetrieveItemMasterForCombo
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
  }
  public getBatchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj",Param);
  }



   
}
