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
  ) {
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
      unitId: [""],
      mobileNo: ["", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      userName: ['',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9_]*')
        ]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern("^\\d{0,12}(\\.\\d*)?$")
        ]
      ],
      mailId: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ]
      ],
      roleId: ["",
        [
          Validators.required
        ]
      ],
      storeId: ["",
        [
          Validators.required
        ]
      ],
      webRoleId: ["",
        [
          Validators.required
        ]
      ],
      isDoctorType: false,
      doctorId: 0,
      isDiscApply: '',
      discApplyPer: [0],
      isGrnverify: "",
      isPoverify: false,
      isPoinchargeVerify: "",
      isIndentVerify: "",
      isInchIndVfy: "",
      pharExtOpt: 0,
      pharOpopt: 0,
      pharIpopt: 0,
      isCollection: "",
      isCurrentStk: '',
      isPatientInfo: '',
      isBedStatus: '',
      addChargeIsDelete: '',
      IsPharmacyBalClearnace: '',
      // browseDay: [""],
      mailDomain: ["1"],
      isRefDocEditOpt: true,
      isDateInterval: true,
      isDateIntervalDays: [0, [
        // Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      loginStatus: true,
      userToken: [""],

      // isCollection: "",
      // isBedStatus: "",
      // isCurrentStk: "",
      // isPatientInfo: "",

      // addChargeIsDelete: "",
      // isIndentVerify: "",
      // isPoinchargeVerify: "",
      // isInchIndVfy: "",



      // IsDoctor:[""],

      // Poverify: "",
      // Grnverify: '',
      // ViewBrowseBill: '0',
      // IsActive: 'true',
      // isActive:[true,[Validators.required]],
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

  public insertuser(Param: any) {
    if (Param.userId) {
      return this._httpClient.PutData("LoginManager/Edit/" + Param.userId, Param);
    } else
      return this._httpClient.PostData("LoginManager/Insert", Param);
  }

  PasswordUpdate(Param: any) {
    return this._httpClient.PostData("LoginManager/updatepassword", Param);
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
    return this._httpClient.PostData("Generic/GetByProc?procName=RtrvUserList", {})
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
    return this._httpClient.PostData("Administration/UserChangePassword", data)
  }


}
