import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MrpAdjustmentService {

  userFormGroup: FormGroup;
  


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.createUserForm();
    
  }

  createUserForm() {
    return this._formBuilder.group({
      StoreId: '',
      ItemID: '',
      BatchNO:'',
      MRP:'',
      MRP1:'',
      Landedrate1:'',
      Landedrate:'',
      PurchaseRate:'',
      PurchaseRate1:'',
      Qty:'',
      BarcodeQty:'',
      BarCodeNo:'',
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
  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo", employee)
  }
  
}
