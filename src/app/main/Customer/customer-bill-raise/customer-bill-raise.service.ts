import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerBillRaiseService {
  myform:FormGroup;
  constructor( 
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { 
    this.myform = this.Createmyform();
   }

   Createmyform(){
    return this._formbuilder.group({
      InvoiceNo:[''],
      InvoiceRaisedId:[''],
      Amount:[''],
      CustomerId:[''],
      InvoiceDate:[new Date()],

    })
   }
   public SaveCustomerBill(Param){
    return this._httpClient.post("CustomerInformation/CustomerInvoiceRaiseSave", Param)
  }
}
