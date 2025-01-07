import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormGroupName } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  myform:FormGroup;

  constructor(
    public _frombuilder : UntypedFormBuilder,
    public _httpClient : HttpClient
  ) 
  {this.myform = this.CreateMyform() }

  CreateMyform(){
    return this._frombuilder.group({
      RegID:[''],
      PatientType:['OP'],
      TemplateDesc:[''],
      Template:[''],
      Department:[''],
      Language:['0']
    })
  }
}
