import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MaterialReceivedFromDepartmentService {
  userFormGroup: UntypedFormGroup;
  MaterialReturnFrDept :UntypedFormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.MaterialReturnFrDept= this.MaterialSearchFrom();
  }

  MaterialSearchFrom() {
    return this._formBuilder.group({
      ToStoreId:[''],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      Status:['0']
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
 
  public getIssuetodeptlist(Param){//m_Rtrv_ReceiveIssueToDep_list_by_Name 
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ReceiveIssueToDep_list_by_Name",Param);
  }

  public getItemdetailList(Param){ 
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_AcceptIssueItemDetList",Param);
  }
  public getItemDetList(Param){ 
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_IssueItemList",Param);
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
   
  public getMaterialreceivedfrDeptview(IssueId){
    return this._httpClient.get("Pharmacy/view-MaterialRecivedFrDept_Report?IssueId=" + IssueId);
  }
  
}
