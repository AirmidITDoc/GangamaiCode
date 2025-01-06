import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PharmaitemsummaryService {

  userFormGroup: UntypedFormGroup;
  SearchGroup :UntypedFormGroup;
  ItemWiseFrom:UntypedFormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
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
      NonMovingDay:'',
      // IsDeleted:['2']
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      // start: [(new Date()).toISOString()],
      start:[(new Date()).toISOString()],
      ExpYear:'',
      ExpMonth:'',
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
 
  public getItemBatchexpwiseList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_PharSales_NonMovingItemList",Param);
  }
  public getItemWithoutBatchexpwiseList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_PharSales_NonMovingItemListWithoutBatchNo",Param);
  }
  public getItemexpdatewise(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Phar_ItemExpReportMonthWise",Param)
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }


  public getNonMovingItemview(NonMovingDay,StoreId ){
    return this._httpClient.get("InventoryTransaction/view-NonMovingItem?NonMovingDay=" + NonMovingDay + "&StoreId=" +StoreId );
  }



  public getExpiryItemview(ExpMonth,ExpYear,StoreID){
    return this._httpClient.get("InventoryTransaction/view-ExpiryItemList?ExpMonth=" + ExpMonth +"&ExpYear="+ExpYear+ "&StoreID=" +StoreID );
  }
}
