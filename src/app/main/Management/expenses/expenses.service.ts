import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { first } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  constructor(
    public _frombuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private _loaderService: LoaderService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  CreateSearchGroup() {
    return this._frombuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      expType: ["3"]
    })
  }

  CreateMyForm() {
    return this._frombuilder.group({
      expId: [0,this._FormvalidationserviceService.onlyNumberValidator()],
      expDate: [''],
      expTime: [''],
      expType: [0],
      expAmount: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      personName: ['',[Validators.required]],
      narration: [''],
      isAddedby: this.accountService.currentUserValue.userId,
      isUpdatedBy: this.accountService.currentUserValue.userId,
      isCancelled: false,
      isCancelledBy: 0,
      voucharNo: "string",
      expHeadId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }
}
