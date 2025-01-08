import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SitedescriptionMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder) {
    this.myform = this.createOtTypeForm();
    this.myformSearch = this.createSearchForm();
  }

  createOtTypeForm(): FormGroup {
    return this._formBuilder.group({
      SiteDescId: [''],
      SiteDescriptionName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      SurgeryCategoryID: ['',
        Validators.required
      ],
      IsDeleted: [true]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      OtSiteDescNameSearch: [""],
    });
  }

  public getSurgerycategoryMasterCombo() {
    debugger
    return this._httpClient.post(
      "Generic/GetByProc?procName=RetrieveSurgeryCategoryForCombo",
      {}
    );
  }

  public OtSiteDescInsert(employee) {
    return this._httpClient.post("OT/SaveMOTSiteDescriptionMaster", employee);
  }
  public OtSiteDescUpdate(employee) {
    return this._httpClient.post("OT/UpdateMOTSiteDescriptionMaster", employee);
  }
}
