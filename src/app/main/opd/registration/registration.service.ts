import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegInsert } from './registration.component';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  myFilterform: FormGroup;
  mySaveForm: FormGroup;
  personalFormGroup: FormGroup;
  registerObj = new RegInsert({});

  constructor(
    public _httpClient:HttpClient,  public _httpClient1:ApiCaller,
    private _formBuilder: FormBuilder,
    private _loaderService: LoaderService
  ) { 
    this.myFilterform=this.filterForm();
    this.personalFormGroup=this.createPesonalForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      FirstName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      MobileNo:['', [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],   
    });
  }
  createPesonalForm() {
    return this._formBuilder.group({
      RegNo:'',
      RegId: '',
      PrefixId: '',
      PrefixID: '',
      FirstName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      MiddleName: ['', [
      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      GenderId: '',
      Address: '',
      DateOfBirth:[{ value: this.registerObj.DateofBirth }],// [{ value: this.registerObj.DateofBirth }, Validators.required],
      AgeYear: '',
      AgeMonth: '',
      AgeDay: '',
      PhoneNo: ['', [
      
        Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(15),
      ]],
      MobileNo: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      AadharCardNo: ['', [
        // Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(12),
        Validators.maxLength(12),
      ]],
      PanCardNo: '',
      MaritalStatusId: '',
      ReligionId: '',
      AreaId: '',
      CityId: '',
      StateId: '',
      CountryId: '',
      IsCharity:'',
    });
  }

  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList",employee)
  }

  public getPrefixCombo(loader = true) {
    if (loader) {
        this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePrefixMasterForCombo", {})
  }

  public getCityListCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo",{})
  }


//Patient Type Combobox List
public getPatientTypeCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrievePatientTypeMasterForCombo", {})
}

  //Area Combobox List
  public getAreaCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_AreaMasterForCombo", {})
  }

    //Marital Combobox List
    public getMaritalStatusCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_MaritalStatusMasterForCombo", {})
    }

    //Religion Combobox List
  public getReligionCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ReligionMasterForCombo", {})
  }

  public getGenderCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", {"Id":Id})
  }
  public getGenderMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_GenderMasterForCombo", {})
  }
  public getStateList(CityId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",{"Id": CityId})
  }
  public getCountryList(StateId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional",{"Id": StateId})
  }
  public regInsert(employee)
  {    
    return this._httpClient.post("OutPatient/OPDRegistrationSave",employee);
  }
  public regUpdate(employee)
  {    
    return this._httpClient.post("OutPatient/OPDRegistrationUpdate",employee);
  }

    //Doctor 1 Combobox List
    public getDoctorMaster1Combo() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorListForCombo", {})
    }
    //Doctor 2 Combobox List
    public getDoctorMaster2Combo() {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorListForCombo", {})
    }
 
    populateFormpersonal(employee,loader=true) {
        if (loader) {
            this._loaderService.show();
        }
      this.personalFormGroup.patchValue(employee);
    }

     //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
  }
  public getregisterList(employee) {
   
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList",employee)
  }
  getregisterListByRegId(employee){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegbyRegID", employee)
  }
  public getAdmittedPatientCasepaaperView(AdmissionId){
  
    return this._httpClient.get("InPatient/view-Admitted_PatientCasepaper?AdmissionId=" + AdmissionId);
  }
  public getRegisteredPatientCasepaaperView(VisitId){
  
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }
  public getAppointmentReport(VisitId){
    return this._httpClient.get("OutPatient/view-PatientAppointment?VisitId=" + VisitId);
  }



  // new Api
     getRegistrationValidationMessages() {
    //     return {
    //         patientName: [
    //             { name: "required", Message: "Patient Name is required" },
    //             { name: "maxlength", Message: "Patient name should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ]
    //     };
    }
    
    public RegstrationtSave(Param: any, showLoader = true) {
        if (Param.regID) {
            return this._httpClient1.PutData("OutPatient/RegistrationInsert" + Param.regID, Param, showLoader);
        } else return this._httpClient1.PostData("OutPatient/RegistrationInsert", Param, showLoader);
    }

    public Regstrationtupdate(Param: any, showLoader = true) {
      if (Param.regID) {
          return this._httpClient1.PutData("OutPatient/RegistrationInsert" + Param.regID, Param, showLoader);
      } else return this._httpClient1.PostData("OutPatient/RegistrationInsert", Param, showLoader);
  }
    
    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("OutPatient/RegistrationInsert", m_data);
    }
}
