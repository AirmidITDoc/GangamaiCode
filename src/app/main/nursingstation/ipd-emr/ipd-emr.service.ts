import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IpdEmrService {

  MyForm: FormGroup;

  constructor(
    // public _formbuilder: UntypedFormBuilder,
    // public _httpClient: HttpClient,
    // public _httpClient1: ApiCaller,
    // private _FormvalidationserviceService: FormvalidationserviceService
    )
     {
    // this.MyForm = this.createMyForm()
  }

 
}
