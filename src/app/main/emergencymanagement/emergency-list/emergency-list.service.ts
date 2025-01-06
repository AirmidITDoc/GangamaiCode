import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmergencyListService {

  MySearchGroup:UntypedFormGroup;
  MyForm:UntypedFormGroup;

  constructor(
    public _frombuilder:UntypedFormBuilder,
    public _httpClient: HttpClient
  ) 
  {
    this.MySearchGroup = this.CreateSearchGroup();
    this.MyForm = this.CreateMyForm();
   }

   CreateSearchGroup(){
    return this._frombuilder.group({
      startdate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      F_Name:[''],
      L_Name:['']
    })
   }
   CreateMyForm(){
    return this._frombuilder.group({
      PrefixID:[''],
      Prefixname: [''],
      GenderId: [''],
      FirstName: ['', [
        Validators.required,
        Validators.maxLength(50),
        // Validators.pattern("^[a-zA-Z._ -]*$"),
        Validators.pattern('^[a-zA-Z () ]*$')
    ]],
    MiddleName: ['', [
    ]],
    LastName: ['', [
        Validators.required,
    ]],
      Address:[''],
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      MobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],

      PinNo:[''],
      DepartmentName:[''],
      DoctorName:[''],
      CityId:[''],
      StateId:[''],
      CountryId:[''],
      DoctorId:[''],
      Departmentid:[''],
      MaritalStatusId:[''],
      ReligionId:[''],
      AreaId:[''],
      AadharCardNo:[''],
      PanCardNo:[''],
      AgeYear:[''],
      AgeMonth:[''],
      AgeDay:[''],
      DateofBirth:['']
    })
   }

   public regInsert(employee)
   {    
     return this._httpClient.post("InPatient/IPDEmergencyRegInsert",employee);
   }


   public getDoctorMasterCombo(Id) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", { "Id": Id })
  }
   public getEmergencyList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CanteenRequestDet",Param);
  }

  public getPrefixMasterCombo() {
    return this._httpClient.post(
        "Generic/GetByProc?procName=RetrievePrefixMasterForCombo",
        {}
    );
}
public getDepartmentCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})

}
public getGenderCombo(Id) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SexMasterForCombo_Conditional", { "Id": Id })
  }
  public getCityList() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
  }
  //StateName Combobox List
  public getStateList(CityId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
  }
  //CountryName Combobox List
  public getCountryList(StateId) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional", { "Id": StateId })
  }

}
