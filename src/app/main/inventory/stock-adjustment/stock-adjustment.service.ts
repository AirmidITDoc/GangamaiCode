import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {

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
      Qty:'',
      IsDeleted:['0'],
      UpdatedQty:''
      
    });
  }
   
  public getStockAdjustList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj",Param);
  }


  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getItemlist1(){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo",{})
  }
  
}
