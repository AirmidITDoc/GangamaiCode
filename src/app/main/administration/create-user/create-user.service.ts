import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {

    myformSearch: FormGroup;
    myuserform: FormGroup;
    
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    )  {
            this.myformSearch = this.createSearchForm();
            this.myuserform = this.createuserForm();
        }
 
    createuserForm(): FormGroup {
        return this._formBuilder.group({
            userId:[0],
            // FirstName:[""],
            // LastName:[""],
            // LoginName:[""],
            // Password:[""],
            // RoleId:[""], // [Validators.minLength(6),Validators.maxLength(6)]],
            // RoleName:[""],
            // IsDoctor:[""],
            // DoctorId:[""],
            // DoctorName:[""],
            // StoreId:[""],
            // StoreName:[""],
            // MailId:[""],
            // MailDomain:[""],
            // Status:[""],
            isActive:[true,[Validators.required]],

            username:[""],
            loginname:[""],
            rolename:[""],
            storename:[""],
            doctorname:[""],
            days:[""]

        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createuserForm();
    }

    public insertuser(Param: any, showLoader = true) {
        if (Param.userId) {
            return this._httpClient.PutData("MReportConfig/" + Param.userId, Param, showLoader);
        } else return this._httpClient.PostData("MReportConfig", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
//   createuserform: FormGroup;
//   myformSearch: FormGroup;

//  constructor(private _httpClient: HttpClient,private _formBuilder: UntypedFormBuilder) {
//    this.createuserform=this.createuserForm();
//     this.myformSearch=this.createSearchForm();
//  }

//  createuserForm(): FormGroup {
//    return this._formBuilder.group({
//      UserId:[''],
//      FirstName:['', [
//        Validators.required,
//        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
//      ]],
//      LastName:['', [
//        Validators.required,
//        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
//      ]],
//      LoginName:[''],
//      Password:[''],
//      RoleId:['', [Validators.minLength(6),Validators.maxLength(6)]],
//      RoleName:[''],
//      IsDoctor:[''],
//      DoctorId:[''],
//      DoctorName:[''],
//      StoreId:[''],
//      StoreName:[''],
//      MailId:[''],
//      MailDomain:[''],
//      Status:[''],
     
//    });
//  }

//  createSearchForm(): FormGroup {
//    return this._formBuilder.group({
//      DoctorNameSearch: [''],
//      IsDeletedSearch: ['2'],

//      UserName:[''],
//    });
//  }


//  initializeFormGroup() {
//    this.createuserForm();
//  }

//  public getUserList() {
//    return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList",{})
//  }

//  public getRoleCombobox() {
//    return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_RoleTemplateForCombo", {})
//  }

//  public getStoreCombo() {
//    return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_StoreMasterForCombo", {})
//  }

 
//  public getDoctorMasterCombo() {
//    return this._httpClient.post("Generic/GetByProc?procName=ps_Cmb_DoctorMasterForCombo", {})
//  }

  
//  public userInsert(employee) {
//    return this._httpClient.post("DoctorMaster/DoctorSave", employee);
//  }
 
//  public UserUpdate(employee) {
//    return this._httpClient.post("DoctorMaster/DoctorUpdate", employee);
//  }

 
//  populateForm(employee) {
//    this.createuserform.patchValue(employee);
//  }
//  public getUserList(employee) {
//   return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList", employee)
// }
// public getpasswwordupdate(data) {
//   return this._httpClient.post("Generic/ExecByQueryStatement?query=" + data, {})
// }


// public getpasswwordChange(data) {
//   return this._httpClient.post("Administration/UserChangePassword" ,data)
// }


}
