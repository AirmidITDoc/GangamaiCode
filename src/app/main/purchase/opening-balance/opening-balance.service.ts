
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class OpeningBalanceService {
StoreForm:FormGroup;
UseFormGroup:FormGroup;
NewUseForm:FormGroup;

   
  constructor(
    public _httpClient:HttpClient,
    public _formbuilder:FormBuilder
  ) 
  {this.UseFormGroup=this.createuseFormGroup() ,
  this.NewUseForm=this.createNewUseForm(),
    this.StoreForm = this.CreateStorForm();
}
CreateStorForm() {
  return this._formbuilder.group({
    StoreId: [''],
  })
}
  createuseFormGroup(){
    return this._formbuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      StoreId:''
    })
  }

  createNewUseForm(){
    return this._formbuilder.group({ 
      ItemName:'',
      BatchNo:'',
      ExpDate:'',
      BalanceQty:'',
      GST:'',
      MRP:'',
      RatePerUnit:'', 
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
    return this._httpClient.post("Inventory/OpeningTransactionSave", Param)
  }
}