import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
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
    // this.myuserform = this.createuserForm();
  }

 

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      DoctorNameSearch: [""],
      IsDeletedSearch: ["2"],
    });
  }

  initializeFormGroup() {
    // this.createuserForm();
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
  

  public userInsert(employee) {
    return this._httpClient.PostData("DoctorMaster/DoctorSave", employee);
  }

  public UserUpdate(employee) {
    return this._httpClient.PostData("DoctorMaster/DoctorUpdate", employee);
  }


  
  public getpasswwordupdate(data) {
    return this._httpClient.PostData("Generic/ExecByQueryStatement?query=" + data, {})
  }
  public getpasswwordChange(data) {
    return this._httpClient.PostData("LoginManager/updatepassword", data)
  }


}
