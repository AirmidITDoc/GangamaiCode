import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  myFilterform: FormGroup;
  mySaveForm: FormGroup;

  constructor(
    public _httpClient:HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.myFilterform=this.filterForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      FirstName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      MobileNo:['', [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],   
    });
  }

  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList",employee)
  }

}
