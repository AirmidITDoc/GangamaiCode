import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class GrnReturnService {


  NewGRNRetFinalFrom: FormGroup;
  GRNReturnSearchFrom :FormGroup;
  NewGRNReturnFrom :FormGroup;
  GRNListFrom:FormGroup;
  GRNReturnStoreFrom:FormGroup;

  constructor(
    public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { 
    this.NewGRNRetFinalFrom = this.NewGRNReturnFinal();
    this.GRNReturnSearchFrom= this.GRNSearchFrom();
    this.NewGRNReturnFrom = this.NewGRNItemList();
    this.GRNListFrom = this.createGRNList();
    this.GRNReturnStoreFrom = this.createStoreForm();
  }
  createStoreForm() {
    return this._formBuilder.group({
      ToStoreId:[this.accountService.currentUserValue.user.storeId,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  GRNSearchFrom() {
    return this._formBuilder.group({ 
      ToStoreId: [this.accountService.currentUserValue.user.storeId,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      SupplierId:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Status:['0'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  
  NewGRNReturnFinal() {
    return this._formBuilder.group({
      Remark:[''],
      FinalTotalAmount:[''],
      FinalNetAmount:[''],
      FinalVatAmount:[''],
      FinalDiscAmountt:[''],
      RoundingAmt:['']
    });
  }

  NewGRNItemList() {
    return this._formBuilder.group({ 
      SupplierId:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      CashType:['true'], 
      Qty:['']
    });
  }
  createGRNList() {
    return this._formBuilder.group({
      SupplierId:['',[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  public getGRNReturnList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_GRNReturnList_by_Name",Param);
  }
  public getGRNReturnItemDetList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=getGRNReturnList",Param);
  }
  public getGRNList(Param){
    return this._httpClient1.PostData("GRNReturn/GRNListBynameforGrnReturn",Param);
  }
  public getSupplierSearchList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SupplierName_list",param);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
 
  public getGrnItemList(Param){
    return this._httpClient1.PostData("GRNReturn/ItemListBYSupplierName",Param);
  }

  public GRNReturnSave(Param){
    return this._httpClient1.PostData("GRNReturn/Insert", Param);
  }

  public getVerifyGRNReturn(Param) {
    return this._httpClient1.PostData("GRNReturn/Verify", Param)
  }
  

  public getGRNreturnreportview(GRNReturnId) {
    return this._httpClient.get("Pharmacy/view-GRNReturnReport?GRNReturnId=" + GRNReturnId);
  }
}


