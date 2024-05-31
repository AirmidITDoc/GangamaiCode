import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentStatusService {
  SearchFormGroup:FormGroup;
  SupplierListForm :FormGroup;
  constructor(
    public _httpClient:HttpClient,
    public _formbuilder:FormBuilder
  )
   { 
    this.SearchFormGroup = this.CreateSearchForm();
    this.SupplierListForm = this.CreateSupplierList();
   }
   CreateSearchForm(){
    return this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      ToStoreId:[''],
      SupplierId:[''],
      Status:['0'],
      NetAmount:[''],
      PaidAmount:[''],
      BalanceAmount:['']
    });
   }
   CreateSupplierList(){
    return this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()], 
      SupplierId:[''], 
    });
   }

   public getSupplierSearchList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getSupplierPayStatusList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNList_ForAccount_payment", param);
  }
}
