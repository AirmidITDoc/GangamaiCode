import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {

  userFormGroup: FormGroup;
  StoreFrom:FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.StoreFrom = this.CreateStoreFrom();
    this.userFormGroup = this.createUserForm();
  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      StoreId: [''],
    });
  }
  createUserForm() {
    return this._formBuilder.group({
    
      ItemID: [''],
      BatchNo:[''],
      MRP:[''],
      Qty:[''],
      Status:[''],
      UpdatedQty:[''],
      BalanceQty:[''],
    });
  }
   
  public getStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj",Param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemMasterForCombo",Param)
  }
  public StockAdjSave(param){
    return this._httpClient.post('Pharmacy/InsertStockadjustment',param);
  }
  
}
