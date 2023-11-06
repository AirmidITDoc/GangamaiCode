import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  myFormGroup:FormGroup;

  constructor(
    public _formBuilder:FormBuilder,
    public _httpClient:HttpClient
  ) 
  { this.myFormGroup=this.createMyFormGroup() }

  createMyFormGroup(){
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      StoreId:'',
      SupplierName:''
    })
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getSupplierList( ){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SupplierName", {});
  }
  public getWorkOrderList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_WorkOrderList_by_Name", Param);
  }
  
}
