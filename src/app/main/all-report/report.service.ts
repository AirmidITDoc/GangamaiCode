import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  myFilterform: FormGroup;

  
  constructor(public _httpClient:HttpClient,
    public _formBuilder: FormBuilder) {
      this.myFilterform=this.filterForm();
    }


  filterForm(): FormGroup {
    return this._formBuilder.group({
    
      UserName:'' ,
      DoctorName: '',
      LastName: '',
      ServiceName: '',
      GroupName: '',
      DepartmentName: '',
      PatientTypeSearch:'',
      patientstatus:'',
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
  }
}
