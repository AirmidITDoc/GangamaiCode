import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReturnFromDepartmentService {

  userFormGroup: FormGroup;
  ReturnSearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.ReturnSearchGroup= this.ReturnSearchFrom();
    this.userFormGroup = this.CreateNewReturnForm();
  }

  ReturnSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      StoreId: '' 
    });
  }
  CreateNewReturnForm() {
    return this._formBuilder.group({
      ToStoreId: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      StoreId: '' 
    });
  }
  
  
 
  public getReturnToDepartmentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ReturnToDepartmentList_1",Param);
  }
  public getNewReturnToDepartmentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ReturnToDepartmentIssueList_1",Param);
  }
  public getNewReturnItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IssueToDepartmentItemDet_1",Param);
  }
  public getToStoreSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  
}
