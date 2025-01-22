import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
 
  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _loaderService: LoaderService
  ) {
    this.myFilterform = this.filterForm();
    this.personalFormGroup = this.createPesonalForm1();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      FirstName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      MobileNo: ['']
      //   , [
      //   Validators.pattern("^[0-9]*$"),
      //   Validators.minLength(10),
      //   Validators.maxLength(10),
      // ]],   
    });
  }
  createPesonalForm() {
    return this._formBuilder.group({
      regId: [0],
      RegNo: '',
      prefixId: ['', [Validators.required]],
      firstName:[""],
      //  ['', [
      //   Validators.required,
      //   Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      // ]],
      middleName: ['', [
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
      ]],
      genderId: new FormControl('', [Validators.required]),
      address: '',
      dateOfBirth: [(new Date()).toISOString()],
      age: ['2'],
      ageYear: ['0', [
        // Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      ageMonth: ['0', [
        Validators.pattern("^[0-9]*$")]],
      ageDay: ['0', [
        Validators.pattern("^[0-9]*$")]],
      phoneNo: ['', [Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      mobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],

      aadharCardNo: ['', Validators.compose([Validators.minLength(12),
      Validators.maxLength(12)
      ])],
      panCardNo: 'ds',
      maritalStatusId: '',
      religionId: '',
      areaId: '',
      cityId: '',
      city: ['d'],
      stateId: '',
      countryId: '',
      isCharity: false,
      isSeniorCitizen: false,
      addedBy: 1,
      updatedBy: 1,
      regDate: [(new Date()).toISOString()],
      regTime: [(new Date()).toISOString()],
      Photo: [''],
      PinNo: [''],
      isActive:[]
    });

  }

  createPesonalForm1() {
    return this._formBuilder.group({
      RegId: [0],
      RegNo: '1',
      PrefixId: ['', [Validators.required]],
      FirstName:['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      MiddleName: ['', [
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
      ]],
      GenderId: new FormControl('', [Validators.required]),
      Address: '',
      DateOfBirth: [(new Date()).toISOString()],
      Age: ['0'],
      AgeYear: ['0', [
        // Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['0', [
        Validators.pattern("^[0-9]*$")]],
      AgeDay: ['0', [
        Validators.pattern("^[0-9]*$")]],
      PhoneNo: ['', [Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      aadharCardNo: ['', [Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern("^[0-9]*$")
        ]],
      // aadharCardNo: ['', Validators.compose([Validators.minLength(12),
      // Validators.maxLength(12), Validators.pattern("^[0-9]*$")
      // ])],
      panCardNo: 'ds',
      MaritalStatusId: '',
      ReligionId: 0,
      AreaId: '',
      CityId: '',
      City: ['d'],
      StateId: '',
      CountryId: '',
      IsCharity: false,
      IsSeniorCitizen: false,
      AddedBy: 1,
      updatedBy: 1,
      RegDate: [],
      RegTime: [(new Date()).toISOString()],
      Photo: [''],
      PinNo: [''],
      // isActive:[]
    });

  }
 // new Api
 initializeFormGroup() {
  this.createPesonalForm1();
}


  public getRegistrationList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RegistrationList", employee)
  }


 
  public RegstrationtSaveData(Param: any, showLoader = true) {
    
    if (Param.RegId) {
      debugger
      return this._httpClient1.PostData("OutPatient/RegistrationUpdate",Param, showLoader);
    } else return this._httpClient1.PostData("OutPatient/RegistrationInsert", Param, showLoader);
  }

 

  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("OutPatient/RegistrationInsert", m_data);
  }

  public getMaster(mode, Id) {
    return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
  }


  public getcityMaster(Id, version) {

    return this._httpClient1.GetData("CityMaster?Id=" + Id + "&version=" + version);
  }
  public getNewRegistrationList(employee) {
    return this._httpClient1.PostData("OutPatient/RegistrationList", employee)
  }
  populateForm(param) {
    this.personalFormGroup.patchValue(param);
  }
  populateFormpersonal(param) { }

  public getRegistraionById(Id,showLoader = true) {
    return this._httpClient1.GetData("OutPatient/" + Id,showLoader);
}

public getcitylist(version){
  return this._httpClient1.GetData("CityMaster/get-cities/" + "&version=" + version);
}

public getPatientListView(mode){
    return this._httpClient1.PostData("Report/ViewReport",mode);
 
}
}
// Set NODE_OPTIONS="--max-old-space-size=8192"
