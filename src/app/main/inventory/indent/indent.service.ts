import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IndentService {
 
  IndentSearchGroup :FormGroup;
  newIndentFrom: FormGroup;
  StoreFrom:FormGroup;

  constructor(
    public _httpClient: HttpClient,   public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService
  ) { 
    this.IndentSearchGroup= this.IndentSearchFrom();
    this.newIndentFrom = this.createnewindentfrom();
    this.StoreFrom = this.CreateStoreFrom();
  }

  IndentSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: 0,
      FromStoreId:this.accountService.currentUserValue.user.storeId,
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      Status:['0'],
    });
  }
  createnewindentfrom() {
    return this._formBuilder.group({
      IndentId:[''],
      ToStoreId: '',
      FromStoreId:'',
      IsUrgent:['0'],
      ItemName:[''],
      Qty:[''],
      Remark:[''],
      ItemNameKit:[''],
      Qtykit:['']
    });
  }
  
  CreateStoreFrom(){
    return this._formBuilder.group({
      FromStoreId:'',
    });
  }

  
  public InsertIndentSave(Param){
    return this._httpClient1.PostData("Indent/Insert", Param)
  }

  public InsertIndentUpdate(Param){
    return this._httpClient.post("InventoryTransaction/IndentUpdate", Param)
  }
  public VerifyIndent(Param){
    return this._httpClient.post("InventoryTransaction/IndentVerify", Param)
  }
  
  public getIndentwiseview(IndentId){
    return this._httpClient.get("InventoryTransaction/view-IndentWise?IndentId=" + IndentId);
  }

 public getIndentVerifyview(IndentId){
    return this._httpClient.get("InventoryTransaction/view-IndentWise?IndentId=" + IndentId);
  }

  public getIndentList(Param){
    return this._httpClient1.PostData("InventoryTransaction/IndentVerify", Param)
  }

  populateForm(employee) {
    this.newIndentFrom.patchValue(employee);
}


  // NewApi
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
}
}
