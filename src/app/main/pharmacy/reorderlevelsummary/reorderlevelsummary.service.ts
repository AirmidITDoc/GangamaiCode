import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReorderlevelsummaryService {
  SearchFrom:FormGroup;
  RaisedIndentFrom:FormGroup;
  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
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
      IndentQty:['', Validators.required]
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
