import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PaymentmodechangeforpharmacyService {

  userFormGroup:FormGroup;
  constructor(
    public _httpClient:HttpClient,
    public _formBuilder:FormBuilder
    ) 
    { this.userFormGroup=this.createUseForm()}

    createUseForm(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        RegNo:'',
        FirstName:'',
        LastName:'',
        SalesNo:'',
        Radio:['1']



      })
    }
}
