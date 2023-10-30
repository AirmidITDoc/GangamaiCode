import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BatchAndExpDateAdjustmentService {

 


  constructor(
    public _httpClient: HttpClient
  ) { }

 
  
     
 

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemMasterForCombo",Param)
  }
  
  
}
