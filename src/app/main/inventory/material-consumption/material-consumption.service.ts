import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class MaterialConsumptionService {

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  FinalMaterialForm : FormGroup;

  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService, private accountService: AuthenticationService,
  ) { 
    this.userFormGroup = this.createUserForm();
    this.SearchGroup= this.createSearchFrom();
    this.FinalMaterialForm = this.createfinalform();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      ToStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      fromDate: [(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      enddate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
    });
  }
  
  createUserForm() {
    return this._formBuilder.group({
      FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
     start:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      end:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      IsPatientWiseConsumption:[true],
      RegID:[''],
      PatientType:['1']
    });
  }

  createItemForm() {
    return this._formBuilder.group({
     
      BatchNO: [''],
      ItemName:[''],
      BalQty:[''],
      UsedQty:[''],
      Rate:[''],
      Remark: [''],
      ItemID:[''],
      start:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      end: [(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
     
    });
  }

  createfinalform() {
    return this._formBuilder.group({
      Remark: [''],
      MRPTotalAmount:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      PurTotalAmount:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      LandedTotalAmount:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]],
      
    });
  }
 
 
  public MaterialconsSave(Param){
    return this._httpClient1.PostData("MaterialConsumption/InsertEDMX",Param);
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
