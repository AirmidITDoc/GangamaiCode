import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PharmaitemsummaryService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  ItemWiseFrom:FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    public _loadService : LoaderService
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
 
  public getItemBatchexpwiseList(Param,loader = true){
    if(loader){
      this._loadService.show();
    }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_PharSales_NonMovingItemList",Param);
  }
  public getItemWithoutBatchexpwiseList(Param,loader = true){
    if(loader){
      this._loadService.show();
    }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_PharSales_NonMovingItemListWithoutBatchNo",Param);
  }
  public getItemexpdatewise(Param,loader = true){
    if(loader){
      this._loadService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Phar_ItemExpReportMonthWise",Param)
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }


  public getNonMovingItemview(NonMovingDay,StoreId,loader = true){
    if(loader){
      this._loadService.show();
    }
    return this._httpClient.get("InventoryTransaction/view-NonMovingItem?NonMovingDay=" + NonMovingDay + "&StoreId=" +StoreId );
  }



  public getExpiryItemview(ExpMonth,ExpYear,StoreID){
    return this._httpClient.get("InventoryTransaction/view-ExpiryItemList?ExpMonth=" + ExpMonth +"&ExpYear="+ExpYear+ "&StoreID=" +StoreID );
  }
}
