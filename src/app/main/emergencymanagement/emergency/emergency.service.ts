import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
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
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
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

  // CreateMyForm() {
  //   return this._frombuilder.group({
  //     regId: [0],
  //     prefixId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
  //     genderId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
  //     firstName: ['', [
  //       Validators.required,
  //       Validators.maxLength(50),
  //       Validators.pattern("^[A-Za-z/() ]*$")
  //     ]],
  //     middleName: ['', [
  //       Validators.maxLength(50),
  //       Validators.pattern("^[A-Za-z/() ]*$")
  //     ]],
  //     lastName: ['', [
  //       Validators.required,
  //       Validators.maxLength(50),
  //       Validators.pattern("^[A-Za-z/() ]*$")
  //     ]],
  //     DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
  //     address: [''],
  //     PinNo: [''],
  //     cityId: [''],
  //     StateId: [''],
  //     CountryId: [''],
  //     PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
  //     mobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
  //     doctorId: [''],
  //     departmentId: [''],
  //     ageYear: [''],
  //   })
  // }

  CreateMyForm() {
    return this._frombuilder.group({
      regId: [0],
      emgDate: [new Date()],
      emgTime: [new Date()],
      firstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      address: ['', [Validators.maxLength(100)]],
      mobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      departmentId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      doctorId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      cityId: [0,[Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ageYear: [''],
      addedBy: [this.accountService.currentUserValue.userId],
      updatedBy: [this.accountService.currentUserValue.userId],
      emgId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

      // extra fields
      PinNo: ['',[Validators.maxLength(6)]],
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      StateId: [''],
      CountryId: [''],
      dateofBirth: [new Date()],
            DateOfBirth:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],

      // dateofBirth: [(new Date()).toISOString(), [this._FormvalidationserviceService.validDateValidator()]]

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

  public EmgSaveUpdate(param: any){
    if(param.emgId){
      return this._httpClient.PutData('Emergency/Edit/'+param.emgId, param)
    }else return this._httpClient.PostData('Emergency/InsertSP',param)
  }

  public EmgCancel(param){
    return this._httpClient.PostData('Emergency/Cancel',param)
  }
  public getDoctorsByDepartment(deptId) {
    return this._httpClient.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
  }
  
}
