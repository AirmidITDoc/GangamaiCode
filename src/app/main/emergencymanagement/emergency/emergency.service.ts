import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  myFilterform: FormGroup;
  MyForm: FormGroup;

  constructor(
    public _frombuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myFilterform = this.CreateSearchGroup();
    this.MyForm = this.CreateMyForm();
  }

  CreateSearchGroup() {
    return this._frombuilder.group({
      fromDate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      F_Name: [''],
      L_Name: ['']
    })
  }

  CreateMyForm() {
    return this._frombuilder.group({
      PrefixID: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      Prefixname: [''],
      GenderId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      FirstName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      MiddleName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      LastName: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      DateOfBirth:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      Address: [''],
      PinNo: [''],
      CityId: [''],
      StateId: [''],
      CountryId: [''],
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      MobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      DoctorId: [''],
      DepartmentId: [''],

      DepartmentName: [''],
      DoctorName: [''],
      MaritalStatusId: [''],
      ReligionId: [''],
      AreaId: [''],
      AadharCardNo: [''],
      PanCardNo: [''],
      AgeYear: [''],
      AgeMonth: [''],
      AgeDay: ['']
    })
  }

  public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }

    public getMaster(mode, Id) {
        return this._httpClient.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
    }

     public getstateId(Id) {
        return this._httpClient.GetData("StateMaster/" + Id);
    }

     public getDoctorsByDepartment(deptId) {
        return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId="+deptId)
    }
}
