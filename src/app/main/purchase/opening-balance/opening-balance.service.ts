
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})

export class OpeningBalanceService {
StoreForm:FormGroup;
UseFormGroup:FormGroup;
NewUseForm:FormGroup;
constructor(
    public _httpClient:HttpClient, public _httpClient1:ApiCaller, private accountService: AuthenticationService,
    public _formbuilder:UntypedFormBuilder,private _FormvalidationserviceService: FormvalidationserviceService,
  ) {}
CreateStorForm() {
  return this._formbuilder.group({
    StoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
  })
}
createsearchFormGroup(){
    return this._formbuilder.group({
      startdate: [(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      enddate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      ToStoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }

  createNewItemForm(){
    return this._formbuilder.group({ 
      ItemName:['', [Validators.required]],
      BatchNo:['', [Validators.required]],
      ExpDate:[''],//['',this._FormvalidationserviceService.validDateValidator()],
      BalanceQty:[0, [Validators.required]],
      GST:[0, [Validators.required]],
      MRP:[0, [Validators.required]],
      RatePerUnit:[0, [Validators.required]],
      Remark:''

    })
  }

    public getReportView(Param) {
        return this._httpClient1.PostData("Report/ViewReport", Param);
      }
      
  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  public getItemNameList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveItemName_GRN", Param);
  }
  public getOpeningBalList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OpeningItemList", Param);
  }
  public getOpeningBalItemDetList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_OpeningItemDet", Param);
  }
  
  public InsertOpeningBalSave(Param){
    return this._httpClient1.PostData("OpeningBalance/OpeningBalanceSave", Param)
  }
}