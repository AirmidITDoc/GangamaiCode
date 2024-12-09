import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {
  myform:FormGroup;
  SearchForm:FormGroup;
  Billmyform:FormGroup;

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient,
    public _loaderService:LoaderService
  )
   { 
    this.myform = this.Createmyform();
    this.SearchForm = this.CreateSearchForm();
    this.Billmyform = this.CreateBillmyform();
   }
   CreateSearchForm(){
    return this._formbuilder.group({
      CustomerName:[''], 
    });
   }
   Createmyform(){
    return this._formbuilder.group({
      CustomerName:[''],
      Address:[''],
      MobileNo:['', [ Validators.required,Validators.pattern('^[0-9]{10}$')]],
      personName:[''],
      PersonMobileNo:['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
      PinCode:[''],
      InstallationDate:[new Date()],

    })
   }
   CreateBillmyform(){
    return this._formbuilder.group({
      InvoiceNo:[''],
      Description:[''],
      Amount:[''],
      CustomerId:[''],
      InvoiceDate:[new Date()],

    })
   }
   public getCustomerList(param, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerInformation_List",param);
  }
   public SaveCustomer(Param, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("CustomerInformation/CustomerInformationSave", Param)
  }
  public UpdateCustomer(Param, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("CustomerInformation/CustomerInformationUpdate", Param)
  }
  public getAmcDetList(Param ,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CustomerAMCInformation_List",Param);
  }
  public SaveCustomerBill(Param,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("CustomerInformation/CustomerInvoiceRaiseSave", Param)
  }
  public UpdateCustomerBill(Param,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("CustomerInformation/CustomerInvoiceRaiseUpdate", Param)
  }
  public getCustomerSearchCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CustomerNameCombo", param);
  }
  public getCustomerBillList(loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=Rtev_CustomerInvoiceRaise_List",{});
  }
  public SaveCustomerPayment(Param,loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("CustomerInformation/CustomerPaymentSave",Param);
  }
}
