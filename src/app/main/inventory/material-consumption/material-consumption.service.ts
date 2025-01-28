import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialConsumptionService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  FinalMaterialForm : FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService : LoaderService
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
  
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }

  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  public MaterialconsSave(Param,loader = true){
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("InventoryTransaction/MaterialConsumptionSave",Param);
  }

  public getLoggedStoreList(Param,loader = true){
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getMaterialConList(Param,loader = true){
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_MaterialConsumption_ByName",Param);
  }
  public getMaterialConDetList(Param,loader = true){
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_MaterialConsumptionDetails_ByName",Param);
  }
  
  public getItemlist(Param,loader = true){
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemName_BalQty_M",Param)
  }
  public getMaterialconsumptionview(MaterialConsumptionId,loader = true){
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.get("InPatient/view-MaterialConsumption?MaterialConsumptionId=" + MaterialConsumptionId);
  }


}
