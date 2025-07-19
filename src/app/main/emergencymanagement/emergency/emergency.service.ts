import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { first } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  myFilterform: FormGroup;
  MyForm: FormGroup;

  constructor(
    public _frombuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private _loaderService: LoaderService,    
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) {
    // this.myFilterform = this.CreateSearchGroup();
    this.MyForm = this.CreateMyForm();
  }

  CreateSearchGroup() {
    return this._frombuilder.group({
      fromDate: [new Date().toISOString()],
      enddate: [new Date().toISOString()],
      firstName: [''],
      L_Name: ['']
    })
  }

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
      StateId: [0,[Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      CountryId: [0,[Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      cityId: [0,[Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      DateOfBirth:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
      ageYear: ['', [Validators.maxLength(3),Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
      ageDay: ['', [Validators.pattern("^[0-9]*$")]],
      comment:['',[Validators.maxLength(200),this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      emgId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

      // extra fields
      PinNo: ['',[Validators.maxLength(6)]],
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      // dateofBirth: [new Date()],
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
  // Insert add Charges 
  public InsertIPAddCharges(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.PostData("IPBill/AddChargeInsert", employee);
  }

  public InsertIPAddChargesNew(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
  return this._httpClient.PostData("IPBill/InsertLabRequest",employee)
  }

   public getchargesList1(data, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.PostData("IPBill/PathRadRequestList",data)
  }
  
  public getchargesList(Id) {
    return this._httpClient.PostData("IPBill/IPAddchargesList" , Id);
}

  public UpdateChargesDetails(employee,Id, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
  return this._httpClient.PutData("IPBill/UpdateAddcharges/"+Id,employee) 
  }

  public AddchargesDelete(m_data, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.PostData("IPBill/IPAddchargesdelete" , m_data);
  }

  public getpackagedetList(employee)
  {    
    return this._httpClient.PostData("IPBill/PackageDetailsList",employee);
  }

    public InsertIPBillingCredit(employee, loader = true) {
    if (loader) {
      this._loaderService.show();
  } 
    return this._httpClient.PostData("IPBill/IPBilllCreditInsert",employee)
  }
}
