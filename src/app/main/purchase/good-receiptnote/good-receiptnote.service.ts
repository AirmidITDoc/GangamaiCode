import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GoodReceiptnoteService {

  userFormGroup: FormGroup;
  GRNSearchGroup :FormGroup;
  GRNForm:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.getGRNForm();
    this.GRNSearchGroup= this.GRNSearchFrom();
  }

  GRNSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      Supplier_Id:'',
      Status:0,
      Status1:0,
      Status2:0,
      Status3:0,
      Verify:0,
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  getGRNForm() {
    return this._formBuilder.group({
      ItemName:[''],
      UOM:[''],
      HSNCode:[''],
      BatchNo:[''],
      Qty:[''],
      ExpDate:[''],
      MRP:[''],
      FreeQty:[''],
      Rate:[''],
      TotalAmount:[''],
      Disc:[''],
      DisAmount:[''],
      GST:[''],
      GSTAmount:[''],
      CGST:[''],
      CGSTAmount:[''],
      SGST:[''],
      SGSTAmount:[''],
      IGST:[''],
      IGSTAmount:[''],
      NetAmount:[''],
      
    });
  }
 
  public getGRNList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNList_by_Name",Param);
  }

  public getGrnItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_GrnItemList",Param);
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

    public getItemNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  
  public GRNSave(Param){
    return this._httpClient.post("Pharmacy/InsertGRNPurchase", Param);
  }
  
}
