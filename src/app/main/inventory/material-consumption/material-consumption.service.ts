import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MaterialConsumptionService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  FinalMaterialForm : FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.createUserForm();
    this.SearchGroup= this.createSearchFrom();
    this.FinalMaterialForm = this.createfinalform();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      StoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      FromStoreId: [''],
      BatchNO: [''],
      ItemName:[''],
      BalQty:[''],
      UsedQty:[''],
      Rate:[''],
      Remark: [''],
      ItemID:[''],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  createfinalform() {
    return this._formBuilder.group({
      Remark: [''],
      MRPTotalAmount: [''],
      PurTotalAmount:[''],
      LandedTotalAmount:[''],
      
    });
  }
 
 


  // public getIndentList(Param){
  //   return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IndentItemList",Param);
  // }

  public MaterialconsSave(Param){
    return this._httpClient.post("InventoryTransaction/MaterialConsumptionSave",Param);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getMaterialConList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_MaterialConsumption_ByName",Param);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemName_BalQty_M",Param)
  }
  public getMaterialconsumptionview(MaterialConsumptionId){
    return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId=" + MaterialConsumptionId);
  }


}
