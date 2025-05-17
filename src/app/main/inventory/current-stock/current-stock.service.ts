import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentStockService {

  dayWiseForm: FormGroup;
  SearchGroup :FormGroup;
  ItemWiseFrom:FormGroup;
  IssueItem:FormGroup;
  ItemSummeryFrom:FormGroup;
  BatchExpWiseFrom:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    public _httpClient1:ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService
  ) { 
    this.dayWiseForm = this.createUserForm();
    this.SearchGroup= this.createSearchFrom();
    this.ItemWiseFrom = this.createItemWiseFrom();
    this.IssueItem=this.PurchaseItemWiseFrom();
    this.ItemSummeryFrom =this.createItemSummeryFrom();
    this.BatchExpWiseFrom =this.createBatchExpwiseFrom();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      StoreId:this.accountService.currentUserValue.user.storeId,
      ItemCategory:['%'],
      IsDeleted:['2']
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      StoreId:this.accountService.currentUserValue.user.storeId,
      ItemCategory:'',      
    });
  }
  createItemWiseFrom(){
    return this._formBuilder.group({
      startSales: [(new Date()).toISOString()],
      endSales: [(new Date()).toISOString()],
      StoreId:this.accountService.currentUserValue.user.storeId,
      ItemCategory:'',
    })
  }
 
  PurchaseItemWiseFrom(){
    return this._formBuilder.group({
      laststart: [(new Date()).toISOString()],
      lastend: [(new Date()).toISOString()],
      StoreId:this.accountService.currentUserValue.user.storeId,
      ItemCategory:'',
    })
  }
 
  createItemSummeryFrom() {
    return this._formBuilder.group({
      start: [''],
      end: [(new Date()).toISOString()],
      StoreId:this.accountService.currentUserValue.user.storeId,
      ItemCategory:'',
    });
  }
  createBatchExpwiseFrom() {
    return this._formBuilder.group({
      start: [''],
      end: [(new Date()).toISOString()],
      StoreId:this.accountService.currentUserValue.user.storeId,
      ItemCategory:'',
    });
  }

  public getCurrentStockList(Param){//Retrieve_Storewise_CurrentStock
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_Storewise_CurrentStock",Param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getDayWiseStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rptStockReportDayWise",Param)
  }
  public getItemWiseStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rpt_ItemWiseSalesReport",Param)
  }
  public getIssueWiseItemStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rpt_ItemWisePurchaseReport", Param)
  }

  // current stock inside list
  public getItemMovementsummeryList(Param){
    return this._httpClient1.PostData("CurrentStock/ItemMovementSummeryList", Param)
  }
  public getBatchExpWiseList(Param){
    return this._httpClient1.PostData("CurrentStock/BatchWiseList",Param);
  }
  public getPueSupplierWiseList(Param){
    return this._httpClient1.PostData("CurrentStock/BatchWiseList",Param);
  }

  // 
  public getSalesList(Param){
    return this._httpClient1.PostData("CurrentStock/SalesList",Param);
  }
  public getSalesRetrunList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_PHAR_SalesReturnList",Param);
  }
   
  public getItemFormList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemName",param);
  }

  // 1.2
  public getIssueSummeryList(param){
    return this._httpClient1.PostData("CurrentStock/IssueSummaryList",param);
  }
  public getIssueSummeryDetailList(param){
    return this._httpClient1.PostData("CurrentStock/IssueDetailsList",param);
  }
  // 

  public getDaywisestockview(LedgerDate,StoreId){
    return this._httpClient.get("InventoryTransaction/view-InvDaywiseStock?LedgerDate=" + LedgerDate+"&StoreId="+StoreId);
  }

  public getCurrentstockview(StoreId,ItemName){
    return this._httpClient.get("InventoryTransaction/view-InvCurrentStock?StoreId=" + StoreId + "&ItemName=" + ItemName);
  }

  public getItemwisestockview(FromDate,todate,StoreId){
    return this._httpClient.get("InventoryTransaction/view-InvItemwiseStock?FromDate=" + FromDate+"&todate="+todate +"&StoreId="+StoreId);
  }

  public ItemWisePurchaseView(FromDate,todate,StoreId){
    return this._httpClient.get("InventoryTransaction/view-ItemWisePurchase?FromDate=" + FromDate+"&todate="+todate +"&StoreId="+StoreId);
  }
  // 1.3
  public getSalesSummeryList(param){
    return this._httpClient1.PostData("CurrentStock/SalesSummaryList",param);
  }
  public getSalesDetailSummeryList(param){
    return this._httpClient1.PostData("CurrentStock/SalesDetailsList",param);
  }
  // 

  // 1.4
  public getSalesReturnSummeryList(param){
    return this._httpClient1.PostData("CurrentStock/SalesReturnSummaryList",param);
  }
  public getSalesReturnDetailSummeryList(param){
    return this._httpClient1.PostData("CurrentStock/SalesReturnDetailsList",param);
  }
// 

  public deactivateTheStatus(m_data) {
    // return this._httpClient.Post("VisitDetail", m_data);
  }
}
