import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SchdulerService {
  createuserform: FormGroup;
  myformSearch: FormGroup;
  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
     this.createuserform=this.createuserForm();
      this.myformSearch=this.createSearchForm();
  }
  public getSchedulers() {
    return this._httpClient.get("Schedule/get-schedulers");
  }
  
 createuserForm(): FormGroup {
  return this._formBuilder.group({
    UserId:[''],
    FirstName:['', [
      Validators.required,
      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    ]],
    LastName:['', [
      Validators.required,
      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
    ]],
    LoginName:[''],
    Password:[''],
    RoleId:['', [Validators.minLength(6),Validators.maxLength(6)]],
    RoleName:[''],
    IsDoctor:[''],
    DoctorId:[''],
    DoctorName:[''],
    StoreId:[''],
    StoreName:[''],
    MailId:[''],
    MailDomain:[''],
    Status:[''],
    
  });
}

createSearchForm(): FormGroup {
  return this._formBuilder.group({
    DoctorNameSearch: [''],
    IsDeletedSearch: ['2'],

    UserName:[''],
  });
}
}
