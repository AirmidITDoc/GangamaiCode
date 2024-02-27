import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BrowsSalesReturnBillService {

  userFormGroup: FormGroup;
  MaterialReturnFrDept :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.MaterialReturnFrDept= this.IndentSearchFrom();
  }

  IndentSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: 0,
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
 
  public getIssuetodeptlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ReceiveIssueToDep_list_by_Name",Param);
  }


  public getItemdetailList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IssueItemList",Param);
  }

  public getStoreFromList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getToList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",{});
  }

  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public AcceptmaterialSave(Param){
    return this._httpClient.post("Pharmacy/UpdateMaterialAcceptance",Param);
  }
}
