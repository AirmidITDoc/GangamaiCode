import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {

  userFormGroup: FormGroup;
  StoreFrom:FormGroup;
  MRPAdjform:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.StoreFrom = this.CreateStoreFrom();
    this.userFormGroup = this.createUserForm();
    this.MRPAdjform = this.createMRPAdjForm();
  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      StoreId: [''],
    });
  }
  createUserForm() {
    return this._formBuilder.group({
      ItemID: [''],
      BatchEdit:[''],
      ExpDateEdit:['']
    });
  }
  createMRPAdjForm() {
    return this._formBuilder.group({
      OldMRP:[''],
      LandedRate:[''],
      PurchaseRate:[''],
      ConversionFactor:[''],
      NewMRP:[''],
      newLandedRate:[''],
      NewPurchaseRate:[''],
      InvoiceDate:[new Date()],
    });
  }
   
  public getStockList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj",Param);
  }
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getItemlist(Param){//m_Rtrv_ItemMasterForCombo
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemName",Param)
  }
  public StockAdjSave(param){
    return this._httpClient.post('InventoryTransaction/StockAdjustment',param);
  }
  public BatchAdjSave(param){//InventoryTransaction/BatchAdjustmen
    return this._httpClient.post('InventoryTransaction/BatchAdjustment',param);
  }
  
}
