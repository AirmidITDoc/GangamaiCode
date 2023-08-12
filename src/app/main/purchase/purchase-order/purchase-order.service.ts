import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  userFormGroup: FormGroup;
  PurchaseSearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.PurchaseOrder();
    this.PurchaseSearchGroup= this.PurchaseSearchFrom();
  }

  PurchaseSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      Supplier_Id:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  PurchaseOrder() {
    return this._formBuilder.group({
      RoleId: '',
      RoleName: '',
      AdmDate:'',
      Date:'',
      StoreName:'',
      PreNo:'',
      IsActive: '',
      
    });
  }
 
  public getPurchaseOrder(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PurchaseOrderList_by_Name",Param);
  }


  public getPurchaseItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PurchaseItemList",Param);
  }

  public getToStoreSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getFromStoreSearchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  public getSupplierSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName",{});
  }
}
