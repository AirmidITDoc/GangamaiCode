import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  myform:FormGroup;

  constructor(
    public _frombuilder : UntypedFormBuilder,
    public _httpClient : HttpClient,
    public _httpClient1:ApiCaller,
  ) 
  {this.myform = this.CreateMyform() }

  CreateMyform() {
    return this._frombuilder.group({
      RegID: [''],
      PatientType: ['OP'],
      MobileNo: '',
      PatientName: '',
      ConsentName: '',
      ConsentText: [''],
      Template: ['',[Validators.required]],
      Department: ['',[Validators.required]],
      Language: ['1'],
      IsIPOrOP:['2'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    })
  }

  public getAdmittedpatientlist(id){
    
    return this._httpClient1.GetData("Admission/" + id);
  }
  public getVisitById(Id) {
    return this._httpClient1.GetData("VisitDetail/" + Id);
}

public getDoctorsByDepartment(deptId) {
  // return this._httpClient1.GetData("VisitDetail/DeptDoctorList?DeptId="+deptId)
}

}
