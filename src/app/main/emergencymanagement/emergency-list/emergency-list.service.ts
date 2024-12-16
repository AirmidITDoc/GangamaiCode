import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class EmergencyListService {

  MySearchGroup:FormGroup;
  MyForm:FormGroup;

  constructor(
    public _frombuilder:FormBuilder,
    public _httpClient: HttpClient,    
    public _loaderService:LoaderService
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
      PrefixID:['', Validators.required],
      Prefixname: [''],
      GenderId: ['',Validators.required],
      FirstName: ['', [
        Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
    ]],
    MiddleName: ['', [
    ]],
    LastName: ['', [
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern('^[a-zA-Z ]*$')
    ]],
      Address:['', Validators.required],
      PhoneNo: [''],
      MobileNo: [''],

      PinNo:[''],
      DepartmentName:[''],
      DoctorName:[''],
      CityId:['', Validators.required],
      StateId:[''],
      CountryId:[''],
      DoctorId:[''],
      Departmentid:['', Validators.required],
      MaritalStatusId:[''],
      ReligionId:[''],
      AreaId:[''],
      AadharCardNo:[''],
      PanCardNo:[''],
      AgeYear:['',
        [
          Validators.required
        ]
      ],
      AgeMonth:[''],
      AgeDay:[''],
      DateofBirth:[(new Date()).toISOString()],
    })
   }

   public regInsert(employee)
   {    
     return this._httpClient.post("InPatient/IPDEmergencyRegInsert",employee);
   }


   public getDoctorMasterCombo(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", param)
  }

  public getEmergencyList(param, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Emergency_list",param);
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
