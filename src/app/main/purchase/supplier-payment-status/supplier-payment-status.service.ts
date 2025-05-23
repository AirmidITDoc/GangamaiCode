import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierPaymentStatusService {
  SearchFormGroup:FormGroup;
  SupplierListForm :FormGroup;
  constructor(
    public _httpClient:HttpClient,  public _httpClient1:ApiCaller,
    public _formbuilder:UntypedFormBuilder,
    private _loaderService:LoaderService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService
  )
   { 
    this.SearchFormGroup = this.CreateSearchForm();
    this.SupplierListForm = this.CreateSupplierList();
   }
   CreateSearchForm(){
    return this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      ToStoreId:this.accountService.currentUserValue.user.storeId,
      SupplierId:[0,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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
      SupplierId:['%'], 
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
  public getSupplierPayStatusList(param){ 
       return this._httpClient1.PostData("SupplierPayment/GetSupplierPaymentStatusList", param);
  }
  public InsertSupplierPay(param){ 
    return this._httpClient1.PostData("SupplierPayment/Insert", param);
  }
}
