import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegInsert } from './registration.component';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  myFilterform: FormGroup;
  mySaveForm: FormGroup;
  personalFormGroup: FormGroup;
  registerObj = new RegInsert({});

  constructor(
    public _httpClient:HttpClient,
    private _formBuilder: FormBuilder
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

  public getPrefixCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrievePrefixMasterForCombo", {})
  }

  public getCityList() {
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
 
    populateFormpersonal(employee) {
      this.personalFormGroup.patchValue(employee);
    }

     //Doctor Master Combobox List
  public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", {"Id":Id})
  }
  public getregisterList(employee) {
   
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList",employee)
  }

}
