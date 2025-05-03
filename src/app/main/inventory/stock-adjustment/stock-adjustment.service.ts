import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {

  userFormGroup: FormGroup;
  StoreFrom:FormGroup;
  MRPAdjform:FormGroup;
  GSTAdjustment : FormGroup;

  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.StoreFrom = this.CreateStoreFrom();
    this.userFormGroup = this.createUserForm();
    this.MRPAdjform = this.createMRPAdjForm();
    this.GSTAdjustment = this.createGSTForm();
  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      StoreId: ['2'],
      ItemID: [''],
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
     // AddedDate:[new Date()],
    });
  }
  createGSTForm() {
    return this._formBuilder.group({
      CGSTPer:[''],
      SGSTPer:[''],
      IGSTPer:[''],
      NewCGSTPer:[''],
      NewSGSTPer:[''],
      NewIGSTPer:[''],
      TotalGSTPer:[''],
      OldTotalGSTPer:['']
    });
  }
   
  public getStockList(Param){//Retrieve_BatchNoForMrpAdj
    return this._httpClient1.PostData("StockAdjustment/ItemWiseStockList",Param);
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
  public MRPAdjSave(param){
    return this._httpClient.post('Pharmacy/InsertMRPadjustment',param);
  }
  public GSTAdjSave(param){
    return this._httpClient.post('InventoryTransaction/GSTAdjustment',param);
  }

  // NewApi
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
  }
}
