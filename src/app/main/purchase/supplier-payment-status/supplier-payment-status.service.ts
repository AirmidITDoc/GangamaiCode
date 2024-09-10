import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentStatusService {
  SearchFormGroup:FormGroup;
  SupplierListForm :FormGroup;
  constructor(
    public _httpClient:HttpClient,
    public _formbuilder:FormBuilder,
    private _loaderService:LoaderService
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

   public getSupplierSearchList(param ,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list", param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getSupplierPayStatusList(param ,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNList_ForAccount_payment", param);
  }
  public InsertSupplierPay(param ,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Pharmacy/InsertSupplierPayment", param);
  }
}
