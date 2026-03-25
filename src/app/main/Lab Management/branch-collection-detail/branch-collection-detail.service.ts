import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class BranchCollectionDetailService {

  constructor(
    private _httpClient: HttpClient,
    private _httpClient1: ApiCaller, private accountService: AuthenticationService, private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder) { }

  createBranchSummarySearchForm(): FormGroup {
    return this._formBuilder.group({
      UnitId: [this.accountService.currentUserValue.user.unitId],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }
}
