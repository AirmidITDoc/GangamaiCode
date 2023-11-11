import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GrnReturnService {


  vGRNReturnheaderList: FormGroup;
  vGRNReturnSearchFilter :FormGroup;
  vGRNReturnItemFilter :FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.vGRNReturnheaderList = this.GRNReturnHeaderList();
    this.vGRNReturnSearchFilter= this.GRNSearchFrom();
    this.vGRNReturnItemFilter = this.GRNSearchItemList();
  }

  GRNSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      SupplierId:'',
      IsVerify:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  GRNReturnHeaderList() {
    return this._formBuilder.group({
    });
  }

  GRNSearchItemList() {
    return this._formBuilder.group({
    });
  }
 
  public getGRNReturnHeaderList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNReturnList_by_Name",Param);
  }

  public getGRNReturnList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=getGRNReturnList",Param);
  }

  public getSupplierSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  public getGRNReturnItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemList_by_Supplier_Name_For_GRNReturn",Param);
  }

}


