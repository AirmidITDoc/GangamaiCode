import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ItemMovemnentService {

  userFormGroup: FormGroup;
  ItemSearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    // this.userFormGroup = this.createUserForm();
    this.ItemSearchGroup= this.createSearchFrom();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      StoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      ItemID:''
    });
  }
  
 
 
  public getItemMovementList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=rptItemMovementReport",Param);
  }


  public getItemFormList(param){//RetrieveItemMasterForCombo
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemName",param);
  }

  public getToStoreFromList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForCombo",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
}
