import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ClinicalCareChartService {

  MyForm:FormGroup;

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
    {this.MyForm = this.createMyForm() }

    createMyForm(){
      return this._formbuilder.group({
        Floor:[''],
        Ward:[''],
        PatientName:[''],
        MRNo:[''],
        DoctorName:[''],
        Age:[''],
        RegID:['']
      })
    }
}
