import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
 
  userFormGroup: FormGroup;
  PurchaseSearchGroup :FormGroup;
  PurchaseOrderForm:FormGroup;
  FinalPurchaseform:FormGroup;
  PurchaseStoreform:FormGroup;
  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.getPurchaseOrderForm();
    this.PurchaseSearchGroup= this.PurchaseSearchFrom();
    this.FinalPurchaseform=this.getPurchaseOrderFinalForm();
    this.PurchaseStoreform=this.PurchaseStoreFrom();
  }

  PurchaseSearchFrom() {
    return this._formBuilder.group({
      StoreId:[''],
      ToStoreId: '',
      FromStoreId:'',
      SupplierId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],


    
      // ItemName:'',
    });
  }

  PurchaseStoreFrom() {
    return this._formBuilder.group({
     
      Freight:[''],
      StoreId:[''],
      SupplierId:[''],
      PaymentMode:[''],
      PaymentTerm:[''],
      TaxNature:[''],
    });
  }
  
  getPurchaseOrderForm() {
    return this._formBuilder.group({
   
      ItemName:[''],
      Qty:[''],
      UOM:[''],
      Rate:[''],
      TotalAmount:[''],
      Dis :[''],
      DiscAmount:[''],
      GSTPer:[''],
      GSTAmount:[''],
      NetAmount :[''],
      MRP:[''],
      Specification:[''],

    });

  }

  getPurchaseOrderFinalForm() {
    return this._formBuilder.group({
   
      PaymentTerm:[''],
      Warranty:[''],
      Schedule:[''],
      OtherTax:[''],
      Remark:[''],
    });

  }

  PurchaseOrder() {
    return this._formBuilder.group({
     
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

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  public getFromStoreSearchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  public getSupplierSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName",{});
  }

  public getItemNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  
  public InsertPurchaseSave(Param){
    return this._httpClient.post("Pharmacy/InsertPurchaseOrder", Param)
  }
  
  public getItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param);
  }
  public PurchaseUpdate(Param){
    return this._httpClient.post("Pharmacy/UpdatePurchaseOrder", Param)
  }
  
  public PurchaseInsert(Param){
    return this._httpClient.post("Pharmacy/InsertPurchaseOrder", Param)
  }

}
