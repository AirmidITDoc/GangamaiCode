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
            userId: [0],
            firstName: ['', [
              Validators.required,
              Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
          ]],
            lastName: ['', [
              Validators.required,
              Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
          ]],
            userName: ['', 
              [
                  Validators.required, 
                  Validators.pattern('[a-zA-Z0-9_]*')
              ]],
            password:[
              "",
              Validators.pattern("^\\d{0,12}(\\.\\d*)?$")
          ],
            roleId: [""],
            storeId: 0,
            isDoctorType: "",
            isPoverify: false,
            isGrnverify: "",
            isCollection: "",
            isBedStatus: "",
            isCurrentStk: "",
            isPatientInfo: "",
            isDateInterval: "",
            isDateIntervalDays: 0,
            mailId: [
              "",
              Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
          ],
            mailDomain: ["1"],
            loginStatus: "",
            addChargeIsDelete: "",
            isIndentVerify: "",
            isPoinchargeVerify: "",
            isRefDocEditOpt: true,
            isInchIndVfy: "",
            webRoleId: 0,
            userToken: [""],
            PharExpOpt:0,
            PharIPOpt:0,
            PharOPOpt:0,

            roomId:[""],
            mobileNo:[ "", [
              Validators.required,
              Validators.minLength(10),
              Validators.maxLength(10),
              Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
          ]],
            browseDay:[""],
            DiscLimitPer:[""],
            IsDoctor:[""],

            Poverify: "",
            Ipoverify: "",
            // Grnverify: '',
            Indentverify: "",
            IIverify: "",
            CollectionInformation: "",
            CurrentStock: '',
            PatientInformation: '',
            ViewBrowseBill: '0',
            IsAddChargeDelete: '',
            IsPharmacyBalClearnace: '',
            BedStatus: '',
            // IsActive: 'true',
            IsDicslimit:'',
            DoctorID:0,
            isActive:[true,[Validators.required]],
        });
    }

  //   createuserForm(): FormGroup {
  //     return this._formBuilder.group({
  //         userId: [0],
  //         firstName: ['', [
  //           Validators.required,
  //           Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
  //       ]],
  //         lastName: ['', [
  //           Validators.required,
  //           Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
  //       ]],
  //         userName: ['', 
  //           [
  //               Validators.required, 
  //               Validators.pattern('[a-zA-Z0-9_]*')
  //           ]],
  //         password:[
  //           "",
  //           Validators.pattern("^\\d{0,12}(\\.\\d*)?$")
  //       ],
  //         roleId: [""],
  //         storeId: 0,
  //         isDoctorType: true,
  //         doctorId: 0,
  //         isPoverify: true,
  //         isGrnverify: true,
  //         isCollection: true,
  //         isBedStatus: true,
  //         isCurrentStk: true,
  //         isPatientInfo: true,
  //         isDateInterval: true,
  //         isDateIntervalDays: 0,
  //         mailId: [
  //           "",
  //           Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
  //       ],
  //         mailDomain: ["1"],
  //         loginStatus: true,
  //         addChargeIsDelete: true,
  //         isIndentVerify: true,
  //         isPoinchargeVerify: true,
  //         isRefDocEditOpt: true,
  //         isInchIndVfy: true,
  //         webRoleId: 0,
  //         userToken: [""],
  //         PharExpOpt:true,
  //         PharIPOpt:true,
  //         PharOPOpt:true,

  //         roomId:[""],
  //         mobileNo:[ "", [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(10),
  //           Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
  //       ]],
  //         browseDay:[""],
  //         DiscLimitPer:[""],
  //         IsDoctor:[""],

  //         Poverify: '',
  //         Ipoverify: '',
  //         // Grnverify: '',
  //         Indentverify: '',
  //         IIverify: '',
  //         CollectionInformation: '',
  //         CurrentStock: '',
  //         PatientInformation: '',
  //         ViewBrowseBill: '0',
  //         IsAddChargeDelete: '',
  //         IsPharmacyBalClearnace: '',
  //         BedStatus: '',
  //         // IsActive: 'true',
  //         IsDicslimit:'',
  //         DoctorID:'',
  //         isActive:[true,[Validators.required]],
  //     });
  // }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createuserForm();
    }

    public insertuser(Param: any) {
        return this._httpClient.PostData("LoginManager/Insert", Param);
    }

    public updateuser(Param: any) {
      if (Param.userId) {
          return this._httpClient.PutData("LoginManager/Edit/" + Param.userId, Param);
      }
  }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("LoginManager/LoginCanceled?Id=" + m_data.toString());
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

 public getUserList() {
   return this._httpClient.PostData("Generic/GetByProc?procName=RtrvUserList",{})
 }

 public getRoleCombobox() {
   return this._httpClient.PostData("Generic/GetByProc?procName=ps_Retrieve_RoleTemplateForCombo", {})
 }

 public getStoreCombo() {
   return this._httpClient.PostData("Generic/GetByProc?procName=ps_Retrieve_StoreMasterForCombo", {})
 }

 
 public getDoctorMasterCombo() {
   return this._httpClient.PostData("Generic/GetByProc?procName=ps_Cmb_DoctorMasterForCombo", {})
 }

  
 public userInsert(employee) {
   return this._httpClient.PostData("DoctorMaster/DoctorSave", employee);
 }
 
 public UserUpdate(employee) {
   return this._httpClient.PostData("DoctorMaster/DoctorUpdate", employee);
 }

 
//  populateForm(employee) {
//    this.createuserform.patchValue(employee);
//  }
//  public getUserList(employee) {
//   return this._httpClient.post("Generic/GetByProc?procName=RtrvUserList", employee)
// }
public getpasswwordupdate(data) {
  return this._httpClient.PostData("Generic/ExecByQueryStatement?query=" + data, {})
}


public getpasswwordChange(data) {
  return this._httpClient.PostData("Administration/UserChangePassword" ,data)
}


}
