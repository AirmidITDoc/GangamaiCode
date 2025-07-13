import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  myform:FormGroup;
  myInsertForm:FormGroup;
  myformSearch:FormGroup;

  constructor(
    public _frombuilder : UntypedFormBuilder,
    public _httpClient : HttpClient,
    public _httpClient1:ApiCaller,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) 
  {this.myform = this.CreateMyform(),
    this.myInsertForm = this.CreateMyInsertform(),
   this.myformSearch = this.createSearchForm(); }
  CreateMyform() {
    return this._frombuilder.group({
      RegID: [''],
      PatientType: ['OP'],
      MobileNo: '',
      PatientName: '',
      ConsentName: '',
      ConsentText: [''],
      Template: ['',[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Department: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Language: ['1'],
      IsIPOrOP:['2'],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    })
  }

   CreateMyInsertform() {
    return this._frombuilder.group({
      consentId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      consentDate: [(new Date()).toISOString()],
      consentTime: [(new Date()).toISOString()],
      opipid:[0,[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      opiptype: [1],
      consentDeptId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      consentTempId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsentName: ['%',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
      // after creating dd need to change above
      ConsentText: ['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
      createdBy: [this._loggedService.currentUserValue.userId,[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      modifiedBy: [this._loggedService.currentUserValue.userId,[Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]]
    })
  }

   createSearchForm(): FormGroup {
    return this._frombuilder.group({
      RegNo: [],
      PatientName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-z]*$")]],
      IsIPOrOP:['2'],
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
    });
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

public ConsentSave(Param: any) {
    if (Param.consentId) {
        return this._httpClient1.PutData("NursingConsent/UpdateConsent", Param);
    } else return this._httpClient1.PostData("NursingConsent/InsertConsent", Param);
}

}
