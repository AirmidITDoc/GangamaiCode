import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@microsoft/signalr';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class BrowsesalesBillService {

  constructor( public _httpClient: HttpClient,
      private _formBuilder: UntypedFormBuilder,
      private _loaderService: LoaderService,
      private _loggedService: AuthenticationService,
      private _FormvalidationserviceService:FormvalidationserviceService) { }

    SearchFilter(): FormGroup {
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        RegNo: '',
        F_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        L_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
        SalesNo: '',
        OP_IP_Type: ['3'], 
        IPNo: '',
        UserId:'',
        PaymentMode:'',
        StoreId: [this._loggedService.currentUserValue.user.storeId,
          [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]], 
      })
    }
}
