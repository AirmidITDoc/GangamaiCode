import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BatchAndExpDateAdjustmentService {
  userFormGroup: FormGroup;
  SearchGroup: FormGroup;
  StoreFrom: FormGroup;

  constructor(
    public _httpClient: HttpClient,
    public _formBuilder: FormBuilder
  ) {
    this.SearchGroup = this.createSearchFrom();
    this.StoreFrom = this.CreateStoreFrom();
  }

  CreateStoreFrom() {
    return this._formBuilder.group({
      StoreId: [''],
    });
  }
  createSearchFrom() {
    return this._formBuilder.group({
      ItemID: '',
    });
  }

  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }
  public getItemlist(Param) {//RetrieveItemMasterForCombo
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemName", Param)
  }
  public getBatchAdjustList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BatchNoForMrpAdj", Param);
  }


}
