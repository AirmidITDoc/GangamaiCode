import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GrnReturnService {


  NewGRNRetFinalFrom: FormGroup;
  GRNReturnSearchFrom :FormGroup;
  NewGRNReturnFrom :FormGroup;
  GRNListFrom:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.NewGRNRetFinalFrom = this.NewGRNReturnFinal();
    this.GRNReturnSearchFrom= this.GRNSearchFrom();
    this.NewGRNReturnFrom = this.NewGRNItemList();
    this.GRNListFrom = this.createGRNList();
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
      TotalAmount:[''],
      NetAmount:[''],
    });
  }

  NewGRNItemList() {
    return this._formBuilder.group({
      ToStoreId: '',
      SupplierId:'',
      CashType:['1'],
      start: [(new Date()).toISOString()],
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
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_GRNReturnList_by_Name",Param);
  }
  public getGRNReturnItemDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_getGRNReturnList",Param);
  }
  public getGRNList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_GRNList_by_Name_For_GRNReturn",Param);
  }
  public getSupplierSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public GRNRetrunSave(Param){
    return this._httpClient.post("Pharmacy/InsertGRNReturn", Param);
  }

  public getGrnItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_GrnItemList",Param);
  }

  public GRNReturnSave(Param){
    return this._httpClient.post("Pharmacy/InsertGRNReturn", Param);
  }



}


