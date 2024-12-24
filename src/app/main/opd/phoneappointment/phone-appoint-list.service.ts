import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class PhoneAppointListService {
  myFilterform: FormGroup;
  mysearchform: FormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _httpClient1: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.myFilterform=this.filterForms();
    this.mysearchform=this.filterForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
     
      FirstNameSearch:['', [
           Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastNameSearch:['', [
        
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      DoctorId:'',
      DoctorName:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],

    });
  }


  filterForms(): FormGroup {
    return this._formBuilder.group({
     
      hospitalId:'0',
      patientTypeID: '0',
      companyId: '0',
      tariffId: '0',
      departmentId: '0',
      doctorId: '0',
      refDocName: '0',
      classId: '0',
      countryId: '0',
      isSeniorCitizen:'0',

    });
  }

  createphoneForm(): FormGroup {
    return this._formBuilder.group({
      phoneAppId: [1],
      appDate:  [(new Date()).toISOString()],
      appTime:  [(new Date()).toISOString()],
     // seqNo: '',
     firstName:  ['', [
        Validators.required,
        Validators.maxLength(50),
        // Validators.pattern("^[a-zA-Z._ -]*$"),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],
      middleName: ['', [

        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      address: ['', Validators.required],
      mobileNo:[''],
      phAppDate: [(new Date()).toISOString()],
      phAppTime: [(new Date()).toISOString()],
      departmentId: '',
      doctorId: [1],
      addedBy: 1,
      updatedBy:1,
      regNo: [''],
   
    });
}





  getValidationMessages() {
    return {
        categoryName: [
            { name: "required", Message: "Category Name is required" },
            { name: "maxlength", Message: "Category name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
}


public getPhoenappschdulelist() {
  return this._httpClient1.post("Generic/GetByProc?procName=Rtrv_ScheduledPhoneApp",{})
}


     //Deartment Combobox List
     public getDepartmentCombo() {
      return this._httpClient1.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }
     //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient1.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
}

// new Api
public phoneMasterSave(Param: any, showLoader = true) {
  if (Param.phoneAppId) {
      return this._httpClient.PutData("PhoneAppointment2/InsertSP" + Param.phoneAppId, Param, showLoader);
  } else return this._httpClient.PostData("PhoneAppointment2/InsertSP", Param, showLoader);
}

public deactivateTheStatus(m_data) {
  return this._httpClient.PostData("PhoneApp", m_data);
}

 
public phoneMasterCancle(Param: any, showLoader = true) {
if (Param.phoneAppId) {
    return this._httpClient.PutData("PhoneAppointment2/Cancel" + Param.phoneAppId, Param, showLoader);
} else return this._httpClient.PostData("PhoneAppointment2/Cancel", Param, showLoader);
} 

public getMaster(mode,Id) {
  return this._httpClient.GetData("Dropdown/GetBindDropDown?mode="+mode+"&Id="+Id);
}
}
