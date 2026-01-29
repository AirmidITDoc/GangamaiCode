import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IssueToDepartmentService {

  constructor(
    public _httpClient: HttpClient,  public _httpClient1: ApiCaller,private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder,private _FormvalidationserviceService: FormvalidationserviceService
  ) { 
  }

  IssueSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      IsClosed:[0]
    });
  }
  getNewIssueForm() {
    return this._formBuilder.group({
      Barcode:[''],
      ItemName:['', [Validators.required]],
      ItemID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      BatchNO:['', [Validators.required]],
      BalanceQty:['', [Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      Qty:['', [Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      UnitRate:['', [Validators.required,this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      TotalAmount:['', [Validators.required,this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      Remark:[''],
      GSTAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      FinalTotalAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      FinalNetAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]], 
    });
  }
  createfinal(){
    return this._formBuilder.group({
      Remark:[''],
      GSTAmount: [0],
      FinalTotalAmount:['', [Validators.required,this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      FinalNetAmount:['', [Validators.required,this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
  }); 
  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ToStoreId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      AgainstIndent:[false],
      ISMaterialAccept:[false],
    });
  }
  createIndentFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      FromStoreId:[0,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ToStoreId:[this.accountService.currentUserValue.user.storeId | 0 [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Status:['1']
     
    });
  }
// IndentListbyVerified
 
  public getIndentList(Param){
    return this._httpClient1.PostData("Indent/IndentListbyVerified",Param);
  }
  public getIndentItemDetList(Param){
    return this._httpClient1.PostData("Indent/IndentDetailsList",Param);
  }
  public getAgainstIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IndentItemList_aginstIssue",Param);
  }
  public getIssueToDepList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IssueToDep_list_by_Name",Param);
  }
  public getIssueItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_IssueItemList",Param);
  }
  
  // public getToStoreSearchList(){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForCombo",{});
  // }
  // public getLoggedStoreList(Param){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  // }
  // public getItemlist(Param){//RetrieveItemMasterForCombo
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param)
  // }
 public getBatchList(Param){ 
    return this._httpClient1.GetData("ItemMaster/GetItemListForSalesBatchPop?StoreId="+Param.StoreId+"&ItemId="+Param.ItemId); 
  }
  public IssuetodepSave(Param){
    return this._httpClient1.PostData("IssueToDepartment/InsertSP",Param);
  }
  public IssuetodepAgaintIndetSave(Param){
    return this._httpClient1.PostData("IssueToDepartment/UpdateIndentStatusAganist",Param);
  }

  public updateStockToMainStock(Param){
    return this._httpClient.post("Pharmacy/UpdateStockToMainStock",Param);
  }
  public getCurrentStockItem(param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrive_CurrentStock_ItemList",param);
  }

  
  public getIssueToDeptview(IssueId){
    return this._httpClient.get("InventoryTransaction/view-IssuetoDeptIssuewise?IssueId=" + IssueId);
  }
  


  // public getIssueToDeptsummaryview(FromDate,Todate,FromStoreId,ToStoreId){
  //   return this._httpClient.get("InventoryTransaction/view-IssuetoDeptSummary?FromDate=" + FromDate + "&Todate ="+Todate  + "&FromStoreId="+FromStoreId  +"&ToStoreId="+ToStoreId);
  // }
  // public getIndentItemBatch(emp){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BatchPOP_BalanceQty",emp);
  // }

 
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
}

  public getVerifyIssue(Param) {
    return this._httpClient1.PostData("Indent/Verify", Param)
  }
}
