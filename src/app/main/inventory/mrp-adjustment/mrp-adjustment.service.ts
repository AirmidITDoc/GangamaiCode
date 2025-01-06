import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MrpAdjustmentService {

  userFormGroup: UntypedFormGroup;
  


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.userFormGroup = this.createUserForm();
    
  }

  createUserForm() {
    return this._formBuilder.group({
      StoreId: '',
      ItemID: '',
      MRP1:'',
      Landedrate1:'',
      PurchaseRate1:'',
      BarcodeQty:'',
      BalanceQty:'',
      
     
    
    });
  }
  
  
 
  public getMRPAdjustList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj",Param);
  }

  public getItemlist1(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo",{})
  }

 
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getRegistrationList(e) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo", e)
  }
 
  
}
