import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomerInformationService {
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
      CustomerName:[''],
      Address:[''],
      MobileNo:['', [ Validators.required,Validators.pattern('^[0-9]{10}$')]],
      personName:[''],
      PersonMobileNo:['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
      PinCode:[''],
      InstallationDate:[new Date()],

    })
   }
   public getCustomerList( ) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtev_CustomerInformation_List",{});
  }
   public SaveCustomer(Param){
    return this._httpClient.post("CustomerInformation/CustomerInformationSave", Param)
  }
  public UpdateCustomer(Param){
    return this._httpClient.post("CustomerInformation/CustomerInformationUpdate", Param)
  }
}
