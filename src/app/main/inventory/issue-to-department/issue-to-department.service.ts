import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IssueToDepartmentService {

  userFormGroup: FormGroup;
  IssueSearchGroup :FormGroup;
  IssueForm:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.getIssueForm();
    this.IssueSearchGroup= this.IssueSearchFrom();
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
  

  getIssueForm() {
    return this._formBuilder.group({
      
      ItemName:  [''],
      Qty: [''],
      ItemID:''
      
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

  public getFromStoreSearchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  
  public getItemNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty_Issue",Param);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo",Param)
  }
   
}
