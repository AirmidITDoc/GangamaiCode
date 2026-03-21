import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class AdmissionCardviewService {

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder) { }
}
