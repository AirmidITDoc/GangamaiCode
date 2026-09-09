import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LabSamCollTestwiseService {

  constructor(private _formBuilder: UntypedFormBuilder,
    private handler: HttpBackend, private _httpClient: HttpClient, private _httpClient1: ApiCaller,
    private _loggedService: AuthenticationService,) {}

     createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: [],
            FirstName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]],
            start: [new Date().toISOString()],
            end: [new Date().toISOString()],
            PBillNo: '',
            CompanyId: 0,
            TestId: 0,
            OutSourceId: 0,
            UnitId: [this._loggedService.currentUserValue.user.unitId]
        });
    }
}
