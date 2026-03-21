import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class FARegistrationService {

    constructor(
        public _httpClient: HttpClient, public _httpClient1: ApiCaller,
        private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService
    ) { }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            FirstName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            MobileNo: ['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
        });
    }

    public getSuggestions(apiUrl: string, inputValue: string): Observable<any[]> {
        return this._httpClient1.GetData(apiUrl + inputValue);
    }
}
