import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PhysiotherapistScheduleService {

  SearchForm :FormGroup

  constructor(
   private _httpClient1: ApiCaller,
   private _formBuilder: FormBuilder
  ) 
  { this.SearchForm = this.CreateSearchForm()}


  CreateSearchForm() {
    return this._formBuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      FirstName: ['', [
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
      ]], 
      PBillNo: '', 
    });
  }
}
