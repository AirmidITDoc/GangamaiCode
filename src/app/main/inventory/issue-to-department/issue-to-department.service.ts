import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IssueToDepartmentService {

  NewIssueGroup: FormGroup;
  IssueSearchGroup :FormGroup;
  StoreFrom:FormGroup;
  IndentFrom:FormGroup;
  IssueFinalForm:FormGroup;
  

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
     
    });
  }
  getNewIssueForm() {
    return this._formBuilder.group({
      // ToStoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Barcode:[''],
      ItemName:['', [Validators.required]],
      ItemID:[''],
      BatchNO:['', [Validators.required]],
      BalanceQty:['', [Validators.required]],
      Qty:['', [Validators.required]],
      UnitRate:['', [Validators.required]],
      TotalAmount:['', [Validators.required]],
      Remark:[''],
      GSTAmount:[''],
      FinalTotalAmount:[''],
      FinalNetAmount:['']  
    });
  }
  createfinal(){
    return this._formBuilder.group({
      Remark:[''],
      GSTAmount:[''],
      FinalTotalAmount:['', [Validators.required]],
      FinalNetAmount:['', [Validators.required]],


    //   issueId: 0,
    // issueDate:new Date(),
    // issueTime: new Date(),
    // fromStoreId:  this.accountService.currentUserValue.user.storeId,
    // toStoreId: 0,
    // totalAmount: 0,
    // totalVatAmount: 0,
    // netAmount: 0,
    // remark: "",
    // addedby: this.accountService.currentUserValue.user.id,
    // isVerified: true,
    // isClosed: true,
    // indentId: 0,
    // tIssueToDepartmentDetails:'',
    // tCurrentStock:''
    }); 
  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ToStoreId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      AgainstIndent:['1']
    });
  }
  createIndentFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      FromStoreId:[''],
      ToStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Status:['0']
     
    });
  }

 
  public getIndentList(Param){
    return this._httpClient1.PostData("Indent/IndentList",Param);
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
    return this._httpClient1.GetData("ItemMaster/GetItemListForSalesBatchPop?StoreId="+Param.StoreId+"&ItemId="+Param.ItemId); 
  }
  public IssuetodepSave(Param){
    return this._httpClient1.PostData("IssueToDepartment/InsertSP",Param);
  }
  public IssuetodepAgaintIndetSave(Param){
    return this._httpClient1.PostData("InventoryTransaction/IssueToDepartmentIndentUpdate",Param);
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
  


  public getIssueToDeptsummaryview(FromDate,Todate,FromStoreId,ToStoreId){
    return this._httpClient.get("InventoryTransaction/view-IssuetoDeptSummary?FromDate=" + FromDate + "&Todate ="+Todate  + "&FromStoreId="+FromStoreId  +"&ToStoreId="+ToStoreId);
  }
  public getIndentItemBatch(emp){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BatchPOP_BalanceQty",emp);
  }

  // NewApi
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
}
}
