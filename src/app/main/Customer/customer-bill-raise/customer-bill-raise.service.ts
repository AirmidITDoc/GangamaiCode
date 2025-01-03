import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerBillRaiseService {
  myform:FormGroup;
  constructor( 
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient,
    public _loaderService:LoaderService
  )
   { 
    this.myform = this.Createmyform();
   }

   Createmyform(){
    return this._formbuilder.group({
      InvoiceNo:[''],
      Description:[''],
      Amount:[''],
      CustomerId:[''],
      InvoiceDate:[new Date()],

    })
   }
   public SaveCustomerBill(Param){
    return this._httpClient.post("CustomerInformation/CustomerInvoiceRaiseSave", Param)
  }
  public UpdateCustomerBill(Param){
    return this._httpClient.post("CustomerInformation/CustomerInvoiceRaiseUpdate", Param)
  }
  public getCustomerSearchCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CustomerNameCombo", param);
  }
  public getCustomerPayDueList(loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerPaymentDueList",{});
  }
  public getCustomerAMCPayList(loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerBillRaiseList",{});
  }

  //added by raksha
  public getPaymentAmtViewList(emp) {
    debugger
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerPaidPaymentInfo",emp);
  }
}
