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
       InvoiceNo: [''],
       Description: [''],
       Amount: [''],
       CustomerId: [''],
       InvoiceDate: [new Date()],
       CustomerNameSearch: [''],

       // filter of m_Rtrv_CustomerPaymentDaySummary   
       start: [(new Date()).toISOString()],
       end: [(new Date()).toISOString()],
       IsAmcOrBill: ['2'],

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
  public getCustomerPayDueList(Param,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_CustomerPaymentDueList",Param);
  }
  public getCustomerAMCPayList(loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerBillRaiseList",{});
  }
  //added by raksha
  public getPaymentAmtViewList(emp,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerPaidPaymentInfo",emp);
  }
  //added by Subhash : 06Jan2025
  public getCustomerPayMonthSummary(loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerPayMonthSummary",{});
  }
  public getCustomerPayReceivedList(Param,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerPayReceivedSummary",Param);
  }
  public getCustomerPaymentDaySummary(Param,loader = true) {
    // if(loader){
    //   this._loaderService.show()
    // }
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_Rtrv_CustomerPaymentDaySummary",Param);
  }
}
