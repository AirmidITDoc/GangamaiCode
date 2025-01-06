import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReorderlevelsummaryService {
  SearchFrom:UntypedFormGroup;
  RaisedIndentFrom:UntypedFormGroup;
  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) 
  {this.SearchFrom = this.createSearchFrom(); 
  this.RaisedIndentFrom = this.createRaisedIndentFrom();}

  createSearchFrom(){
    return this._formBuilder.group({
      Type:[''],
      ReorderQty:['']
    });
  }
  createRaisedIndentFrom(){
    return this._formBuilder.group({
      ToStoreId:[''],
      IndentQty:[''],

    });
  }
  
  public getIssuTrackerList(params){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrvItemReorderList",params);
  }
  public getToStoreNameSearch(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }
  
  public RaisedIndentSave(Param){
    return this._httpClient.post("InventoryTransaction/IndentSave", Param)
  }
}
