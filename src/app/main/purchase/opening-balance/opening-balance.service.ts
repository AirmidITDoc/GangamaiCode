
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})

export class OpeningBalanceService {
StoreForm:FormGroup;
UseFormGroup:FormGroup;
NewUseForm:FormGroup;

   
  constructor(
    public _httpClient:HttpClient, public _httpClient1:ApiCaller,
    public _formbuilder:UntypedFormBuilder
  ) 
  {
   
}
CreateStorForm() {
  return this._formbuilder.group({
    StoreId: [''],
  })
}
createsearchFormGroup(){
    return this._formbuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      ToStoreId:['2']
    })
  }

  createNewItemForm(){
    return this._formbuilder.group({ 
      ItemName:['', [Validators.required]],
      BatchNo:['', [Validators.required]],
      ExpDate:'',
      BalanceQty:[0, [Validators.required]],
      GST:[0, [Validators.required]],
      MRP:[0, [Validators.required]],
      RatePerUnit:[0, [Validators.required]],
      Remark:''

    })
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  public getOpeningBalList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OpeningItemList", Param);
  }
  public getOpeningBalItemDetList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OpeningItemDet", Param);
  }
  
  public InsertOpeningBalSave(Param){
    return this._httpClient1.PostData("Inventory/OpeningTransactionSave", Param)
  }
}