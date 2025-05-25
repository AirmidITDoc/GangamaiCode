import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IndentService {
   constructor(
    public _httpClient: HttpClient,   public _httpClient1: ApiCaller,  public datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService, private _FormvalidationserviceService: FormvalidationserviceService
  ) {  }

  IndentSearchFrom() {
    return this._formBuilder.group({
      ToStoreId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      FromStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      startdate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      Status:[0],
    });
  }
  createnewindentfrom() {
    return this._formBuilder.group({
      IndentId:[''],
      ItemName: ['', [Validators.required]],
      Qty:   ['', [Validators.required, Validators.maxLength(10)]],
      Remark:['',Validators.maxLength(500)],
      ItemNameKit:[''],
      Qtykit:['']
    });
  }
  
  
  public InsertIndentSave(Param){
   
    if (Param.indentId) {
      return this._httpClient1.PutData("Indent/Edit/" + Param.indentId, Param)
      } else return this._httpClient1.PostData("Indent/Insert", Param);
  }

  
  public getVerifyIndent(Param){
    return this._httpClient1.PostData("Indent/Verify", Param)
  }
  
  public getIndentwiseview(IndentId){
    return this._httpClient.get("InventoryTransaction/view-IndentWise?IndentId=" + IndentId);
  }

 public getIndentVerifyview(IndentId){
    return this._httpClient.get("InventoryTransaction/view-IndentWise?IndentId=" + IndentId);
  }

  public getIndentList(Param){
    return this._httpClient1.PostData("Indent/IndentDetailsList", Param)
  }

  populateForm(employee) {
    // this.newIndentFrom.patchValue(employee);
}


  // NewApi
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("BedMaster", m_data);
}
}
