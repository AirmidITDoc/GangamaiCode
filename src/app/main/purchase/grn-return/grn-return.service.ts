import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GrnReturnService {


  NewGRNRetFinalFrom: UntypedFormGroup;
  GRNReturnSearchFrom :UntypedFormGroup;
  NewGRNReturnFrom :UntypedFormGroup;
  GRNListFrom:UntypedFormGroup;
  GRNReturnStoreFrom:UntypedFormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.NewGRNRetFinalFrom = this.NewGRNReturnFinal();
    this.GRNReturnSearchFrom= this.GRNSearchFrom();
    this.NewGRNReturnFrom = this.NewGRNItemList();
    this.GRNListFrom = this.createGRNList();
    this.GRNReturnStoreFrom = this.createStoreForm();
  }
  createStoreForm() {
    return this._formBuilder.group({
      ToStoreId: '',
    });
  }
  GRNSearchFrom() {
    return this._formBuilder.group({ 
      ToStoreId: '',
      SupplierId:'',
      Status:['0'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  NewGRNReturnFinal() {
    return this._formBuilder.group({
      Remark:[''],
      FinalTotalAmount:[''],
      FinalNetAmount:[''],
      FinalVatAmount:[''],
      FinalDiscAmountt:[''],
      RoundingAmt:['']
    });
  }

  NewGRNItemList() {
    return this._formBuilder.group({ 
      SupplierId:'',
      CashType:['true'], 
      Qty:['']
    });
  }
  createGRNList() {
    return this._formBuilder.group({
      SupplierId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  public getGRNReturnList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNReturnList_by_Name",Param);
  }
  public getGRNReturnItemDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=getGRNReturnList",Param);
  }
  public getGRNList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNList_by_Name_For_GRNReturn",Param);
  }
  public getSupplierSearchList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list",param);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
 
  public getGrnItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemList_by_Supplier_Name_For_GRNReturn",Param);
  }

  public GRNReturnSave(Param){
    return this._httpClient.post("Pharmacy/InsertGRNReturn", Param);
  }

  public getVerifyGRNReturn(Param) {
    return this._httpClient.post("Pharmacy/VerifyGRNReturn", Param)
  }
  

  public getGRNreturnreportview(GRNReturnId) {
    return this._httpClient.get("Pharmacy/view-GRNReturnReport?GRNReturnId=" + GRNReturnId);
  }
}


