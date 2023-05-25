import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {

  constructor(public _httpClient:HttpClient,
    public _formBuilder: FormBuilder) { }

  public getStoreCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_M_StoreMaster_Cmb", {})
  }
}
