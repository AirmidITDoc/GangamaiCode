import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ConsentService {
  myform:FormGroup;
  myInsertForm:FormGroup;

  constructor(
    public _frombuilder : UntypedFormBuilder,
    public _httpClient : HttpClient,
    public _httpClient1:ApiCaller,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) 
  {this.myform = this.CreateMyform(),
    this.myInsertForm = this.CreateMyInsertform() }

  // CreateMyform() {
  //   return this._frombuilder.group({
  //     RegID: [''],
  //     PatientType: ['OP'],
  //     MobileNo: '',
  //     PatientName: '',
  //     ConsentName: '',
  //     ConsentText: [''],
  //     Template: ['',[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  //     Department: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  //     Language: ['1'],
  //     IsIPOrOP:['2'],
  //     start: [(new Date()).toISOString()],
  //     end: [(new Date()).toISOString()],
  //   })
  // }

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
      consentId: [0],
      consentDate: [(new Date()).toISOString()],
      consentTime: [(new Date()).toISOString()],
      opipid:[],
      opiptype: [1],
      consentDeptId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      consentTempId: ['',[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsentName: '',
      ConsentText: [''],
      createdBy: this._loggedService.currentUserValue.userId,
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

public ConsentSave(Param: any) {
        if (Param.bankId) {
            return this._httpClient1.PutData("NursingConsent/UpdateConsent/" + Param.bankId, Param);
        } else return this._httpClient1.PostData("NursingConsent/InsertConsent", Param);
    }

}
