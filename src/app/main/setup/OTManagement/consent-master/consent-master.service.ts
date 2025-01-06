import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConsentMasterService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
    this.myform = this.createOtConsentForm();
    this.myformSearch = this.createSearchForm();
  }

  createOtConsentForm(): FormGroup {
    return this._formBuilder.group({

    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      OtConsentNameSearch: [""],
    });
  }
}
