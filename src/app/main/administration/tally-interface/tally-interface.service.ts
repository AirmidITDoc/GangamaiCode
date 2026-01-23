import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class TallyInterfaceService {
  tallyForm: FormGroup;
  myformSearch: FormGroup;

  constructor(
    public _httpClient:ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder,  private accountService: AuthenticationService,
  ) {
    // this.tallyForm = this.CreaterTallyForm()
    // this.myformSearch = this.createSearchForm();
  }




    myFilterbillbrowseform() {
    return this._formBuilder.group({
     fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }

   
  myFilterrIPBillform(): FormGroup {
    return this._formBuilder.group({

      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }
 
  myFilterOpcashcounerform(): FormGroup {
    return this._formBuilder.group({

   
      fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
  
    });
  }
 
  myFilterIPAdvanceform(): FormGroup {
    return this._formBuilder.group({

   
      fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
  
    });
  }

   myFiltersalesform(): FormGroup {
    return this._formBuilder.group({
    fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      StoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  
    });
  }
  
  myFilterpurchaseform(): FormGroup {
    return this._formBuilder.group({
    fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
   StoreId:[this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  
    });
  }


  public getOpbilllist(emp, loader = true) {

    return this._httpClient.PostData("Generic/GetByProc?procName=m_Tally_OPBillList_CashCounter", emp)
  }
  public getOpRefundist(param) {

    return this._httpClient.PostData("Tally/TallyOPRefundBillCounterList", param);
  }
  public getAdvancelist(param, loader = true) {

    return this._httpClient.PostData("Tally/TallyOPRefundBillCounterList", param);
  }
  public getAdvanceReflist(param, loader = true) {

    return this._httpClient.PostData("Tally/TallyOPRefundBillCounterList", param);
  }
  public getipBIlllist(param, loader = true) {

    return this._httpClient.PostData("Tally/TallyOPRefundBillCounterList", param);
  }
  public getippaymentwiselist(param, loader = true) {

    return this._httpClient.PostData("Tally/TallyOPRefundBillCounterList", param);
  }
  public getipbillcashcounterlist(param, loader = true) {

    return this._httpClient.PostData("Tally/TallyOPRefundBillCounterList", param);
  }
  public getipbillRefundlist(param) {

    return this._httpClient.PostData("IPBill/BillChargeDetailsList", param);
  }
  public getPurcahselist(emp, loader = true) {

    return this._httpClient.PostData("Generic/GetByProc?procName=m_Tally_PurchaseWiseSupplier", emp)
  }
  public getPharmacylist(emp, loader = true) {

    return this._httpClient.PostData("Generic/GetByProc?procName=m_Tally_Phar2_Sales", emp)
  }
  public getPharmaPaymentlist(emp, loader = true) {

    return this._httpClient.PostData("Generic/GetByProc?procName=m_Tally_Phar2_Payment", emp)
  }
  public getPharmaSalesReturnlist(emp, loader = true) {

    return this._httpClient.PostData("Generic/GetByProc?procName=m_Tally_Phar2_SalesReturn", emp)
  }
  public getPharmaSalesreceiptlist(emp, loader = true) {

    return this._httpClient.PostData("Generic/GetByProc?procName=m_Tally_Phar2_Receipt", emp)
  }
  public getStoreList() {
    return this._httpClient.PostData("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
  }
}

