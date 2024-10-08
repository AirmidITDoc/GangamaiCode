import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {

 
  createuserform: FormGroup;
  myformSearch: FormGroup;

 constructor(private _httpClient: HttpClient,
  private _formBuilder: FormBuilder,
  private _loaderService:LoaderService
) {
   this.createuserform=this.createuserForm();
    this.myformSearch=this.createSearchForm();
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


 initializeFormGroup() {
   this.createuserForm();
 }

//  public getUserList() {
//    return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList",{})
//  }

 public getRoleCombobox() {
   return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_RoleTemplateForCombo", {})
 }

 public getStoreCombo() {
   return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_StoreMasterForCombo", {})
 }

 
 public getDoctorMasterCombo() {
   return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_DoctorMasterForCombo", {})
 }

  
 public userInsert(employee) {
   return this._httpClient.post("DoctorMaster/DoctorSave", employee);
 }
 
 public UserUpdate(employee) {
   return this._httpClient.post("DoctorMaster/DoctorUpdate", employee);
 }

 
 populateForm(employee) {
   this.createuserform.patchValue(employee);
 }
 public getUserList(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList", employee)
}
public getpasswwordupdate(data) {
  return this._httpClient.post("Generic/ExecByQueryStatement?query=" + data, {})
}


public getpasswwordChange(data) {
  return this._httpClient.post("Administration/UserChangePassword" ,data)
}
public PasswordRest(m_data,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}

}
