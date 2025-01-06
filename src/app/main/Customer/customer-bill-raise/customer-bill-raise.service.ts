import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerBillRaiseService {
  myform:UntypedFormGroup;
  constructor( 
    public _formbuilder:UntypedFormBuilder,
    public _httpClient:HttpClient
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
  public getCustomerBillList( ) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtev_CustomerInvoiceRaise_List",{});
  }
}
