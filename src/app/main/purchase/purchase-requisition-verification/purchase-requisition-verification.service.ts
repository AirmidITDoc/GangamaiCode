import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequisitionVerificationService {

  constructor(
    public _httpClient1: ApiCaller,private accountService: AuthenticationService,
    private _formBuilder: UntypedFormBuilder,    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  SearchFilterForm(): FormGroup {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FromStoreId:this.accountService.currentUserValue.user.storeId,
      ToStoreId: [0],
      Closed: [0],
      Verify:[0]
    })
  }

  // SearchFrom() {
  //     return this._formBuilder.group({
  //       ToStoreId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  //       FromStoreId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  //       startdate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
  //       enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
  //       Verify: [0],
  //       Closed: [0],
  //       Active: ["1"],
  //     });
  //   }
    createnewPurchaserequfrom() {
      return this._formBuilder.group({
        IndentId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        ItemName: ['', [Validators.required]],
        Qty: ['', [Validators.required, Validators.maxLength(10), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        Remark: ['', Validators.maxLength(500)],
        ItemNameKit: [''],
        Qtykit: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
      });
    }
  
  

    public PurchaseRequisitionSave(Param) {
    debugger
    if (!Param.purchaseRequisitionId)
      return this._httpClient1.PostData("PurchaseRequisition/Insert", Param);
    else
      return this._httpClient1.PutData("PurchaseRequisition/Edit/" + Param.purchaseRequisitionId, Param)
  }

  
  public getDetailList(Param) {
    return this._httpClient1.PostData("PurchaseRequisition/PurRequisiionItemList", Param);
  }

  
  public getVerifyRequisiion(Param) {
    return this._httpClient1.PostData("PurchaseRequisition/Verify", Param)
  }

 
  // public getIndentList(Param) {
  //   return this._httpClient1.PostData("Indent/IndentDetailsList", Param)
  // }


  public RequisiionCancle(Param) {
    debugger
    return this._httpClient1.PostData("PurchaseRequisition/Cancel", Param)
  }

}
