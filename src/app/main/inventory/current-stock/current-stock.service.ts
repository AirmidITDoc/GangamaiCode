import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CurrentStockService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  ItemWiseFrom:FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.createUserForm();
    this.SearchGroup= this.createSearchFrom();
    this.ItemWiseFrom = this.createItemWiseFrom();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      // start: [(new Date()).toISOString()],
      // end: [(new Date()).toISOString()],
      StoreId:'',
      ItemCategory:'',
      IsDeleted:['2']
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      StoreId:'',
      
    });
  }
  createItemWiseFrom(){
    return this._formBuilder.group({
      start1: [(new Date()).toISOString()],
      end1: [(new Date()).toISOString()],
      StoreId:'',
    })
  }
 
  public getCurrentStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Storewise_CurrentStock",Param);
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
  public getItemWiseStockListPrint(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rpt_ItemWiseSalesReport", Param)
  }

  public getDaywisestockview(LedgerDate,StoreId){
    return this._httpClient.get("InventoryTransaction/view-InvDaywiseStock?LedgerDate=" + LedgerDate+"&StoreId="+StoreId);
  }

  public getCurrentstockview(StoreId,ItemName){
    return this._httpClient.get("InventoryTransaction/view-InvCurrentStock?StoreId=" + StoreId + "&ItemName=" + ItemName);
  }

  public getItemwisestockview(FromDate,todate,StoreId){
    return this._httpClient.get("InventoryTransaction/view-InvItemwiseStock?FromDate=" + FromDate+"&todate="+todate +"&StoreId="+StoreId);
  }
}
