import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IndentService {
  // deleteItem(displayedColumns2: string[], ItemID: any, ItemName: any, Qty: any) {
  //   throw new Error('Method not implemented.');
  // }
  // IndentList() {
  //   throw new Error('Method not implemented.');
  // }

  IndentSearchGroup :FormGroup;
  newIndentFrom: FormGroup;
  StoreFrom:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.IndentSearchGroup= this.IndentSearchFrom();
    this.newIndentFrom = this.createnewindentfrom();
    this.StoreFrom = this.CreateStoreFrom();
  }

  IndentSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      Status:['0'],
    });
  }
  createnewindentfrom() {
    return this._formBuilder.group({
      IndentId:[''],
      ToStoreId: '',
      FromStoreId:'',
      // ItemId:[''],
      ItemName:[''],
      Qty:[''],
      Remark:[''],
    });
  }
  
  CreateStoreFrom(){
    return this._formBuilder.group({
      FromStoreId:'',
    });
  }

  
  public getIndentID(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_IndentList_by_ID",Param);
  }

  public getIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IndentItemList",Param);
  }
  public getupdateIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDetailsForIndentUpdate",Param);
  }
  
  public getIndentNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RtrvItemName_Indent",Param);
  }

  public getFromStoreNameSearch(Params){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Params);
  }
  
  public getToStoreNameSearch(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public InsertIndentSave(Param){
    return this._httpClient.post("InventoryTransaction/IndentSave", Param)
  }

  public InsertIndentUpdate(Param){
    return this._httpClient.post("InventoryTransaction/IndentUpdate", Param)
  }
  public VerifyIndent(Param){
    return this._httpClient.post("InventoryTransaction/IndentVerify", Param)
  }
  populateForm(employee) {
    this.newIndentFrom.patchValue(employee);
}
}
