import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class MaterialConsumptionService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  FinalMaterialForm : FormGroup;

  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.userFormGroup = this.createUserForm();
    this.SearchGroup= this.createSearchFrom();
    this.FinalMaterialForm = this.createfinalform();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: ['2'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      FromStoreId: ['2'],
      BatchNO: [''],
      ItemName:[''],
      BalQty:[''],
      UsedQty:[''],
      Rate:[''],
      Remark: [''],
      ItemID:[''],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      IsPatientWiseConsumption:[true],
      RegID:[''],
      PatientType:['1']
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

  // NewApi
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
  }

}
