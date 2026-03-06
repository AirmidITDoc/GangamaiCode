import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class LabRadApprovallistService {
  myformSearch: FormGroup;

  myform: FormGroup;
  constructor(
    private _httpClient: HttpClient,
    private _httpClient1: ApiCaller, private accountService: AuthenticationService, private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder) {
    this.myformSearch = this.createSearchForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      RegNoSearch: [],
      FirstNameSearch: ['', [
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],
      LastNameSearch: ['', [
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],

      PatientTypeSearch: ['3'],
      StatusSearch: ['1'],
      CategoryId: [''],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      TestStatusSearch: ['1'],
      UnitId: [this.accountService.currentUserValue.user.unitId],
      // CategoryId:0
    });
  }

  public getarrovallist(employee) {
    return this._httpClient1.PostData("Radiology/LabRadiologyApproveList", employee)
  }
  public getReportView(Param) {
     return this._httpClient1.PostData("Report/ViewReportFromDB", Param);
  }
}
