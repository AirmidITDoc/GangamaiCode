import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {

  userFormGroup: FormGroup;
  StoreFrom:FormGroup;
  MRPAdjform:FormGroup;
  GSTAdjustment : FormGroup;

  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller, private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService
  ) { 
    this.StoreFrom = this.CreateStoreFrom();
    this.userFormGroup = this.createUserForm();
    this.MRPAdjform = this.createMRPAdjForm();
    this.GSTAdjustment = this.createGSTForm();
 this.MRPAdjform.markAllAsTouched();

  }
  CreateStoreFrom(){
    return this._formBuilder.group({
      StoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ItemID: [''],
      batchEdit:[''],
      expDateEdit:''
    });
  }
  createUserForm() {
    return this._formBuilder.group({
      ItemID:  [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      BatchEdit:[''],
      ExpDateEdit:['']
    });
  }
  createMRPAdjForm() {
    return this._formBuilder.group({
      OldMRP: ['', [ Validators.required,Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      LandedRate: ['', [ Validators.required,Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      PurchaseRate: ['', [ Validators.required,Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      ConversionFactor: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      NewMRP: ['', [ Validators.required,Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      newLandedRate: ['', [ Validators.required,Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      NewPurchaseRate: ['', [ Validators.required,Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
     // AddedDate:[new Date()],
    });
  }
  createGSTForm() {
    return this._formBuilder.group({
      CGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      SGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      IGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      NewCGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      NewSGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      NewIGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      TotalGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
      OldTotalGSTPer: [0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
   
    createExpForm() {
    return this._formBuilder.group({
       NewexpDate:[new Date().toISOString()],
       OldexpDate:[''],
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
    return this._httpClient1.PostData('InventoryTransaction/StockAdjustment',param);
  }
  public BatchAdjSave(param){//InventoryTransaction/BatchAdjustmen
    return this._httpClient1.PostData('StockAdjustment/BatchUpdate',param);
  }
  public MRPAdjSave(param){
    return this._httpClient1.PostData('StockAdjustment/MrpAdjustmentUpdate',param);
  }
  public GSTAdjSave(param){
    return this._httpClient1.PostData('StockAdjustment/GSTUpdate',param);
  }

  // NewApi
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
  }
}
