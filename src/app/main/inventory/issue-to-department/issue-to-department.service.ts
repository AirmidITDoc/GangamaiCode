import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IssueToDepartmentService {

  NewIssueGroup: FormGroup;
  IssueSearchGroup :FormGroup;
  StoreFrom:FormGroup;
  IndentFrom:FormGroup;
  

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.NewIssueGroup = this.getNewIssueForm();
    this.IssueSearchGroup= this.IssueSearchFrom();
    this.StoreFrom = this.CreateStoreFrom();
    this.IndentFrom = this.createIndentFrom();
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
      Barcode:[''],
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
      FinalNetAmount:['']  
    });
  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      FromStoreId:'',
    });
  }
  createIndentFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      FromStoreId:[''],
      Status:['0']
     
    });
  }

 
  public getIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Indent_by_ID",Param);
  }
  public getIndentItemDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=retrieve_IndentItemList",Param);
  }
  public getAgainstIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IndentItemList_aginstIssue",Param);
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
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj",Param);
  }
  public IssuetodepSave(Param){
    return this._httpClient.post("InventoryTransaction/IssuetoDepartmentSave",Param);
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
  
}
// rptNonMovingItemList  RptItemExpReportMonthWise