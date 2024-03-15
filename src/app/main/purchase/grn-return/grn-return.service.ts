import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GrnReturnService {


  vGRNReturnheaderList: FormGroup;
  GRNReturnSearchFrom :FormGroup;
  NewGRNReturnFrom :FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.vGRNReturnheaderList = this.GRNReturnHeaderList();
    this.GRNReturnSearchFrom= this.GRNSearchFrom();
    this.NewGRNReturnFrom = this.NewGRNItemList();
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
  
  GRNReturnHeaderList() {
    return this._formBuilder.group({
    });
  }

  NewGRNItemList() {
    return this._formBuilder.group({
      ToStoreId: '',
      SupplierId:'',
      CashType:['1'],
      ReturnDate: [(new Date()).toISOString()],
    });
  }
  public getGRNReturnList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_GRNReturnList_by_Name",Param);
  }
  public getGRNReturnItemDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_getGRNReturnList",Param);
  }
  public getSupplierSearchList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }





  


}


