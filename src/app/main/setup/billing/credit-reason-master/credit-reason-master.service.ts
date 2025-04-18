import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CreditReasonMasterService {
  CreditReasonForm:FormGroup
  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient,
    public _loaderService:LoaderService
  )
   { this.CreditReasonForm = this.CreateCreditRasForm()}
   CreateCreditRasForm(){
    return this._formbuilder.group({
      
    })
   }
}
