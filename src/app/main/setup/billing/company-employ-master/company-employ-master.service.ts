import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})

export class CompanyEmployMasterService {

  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private _loaderService: LoaderService,
    public _configue: ConfigService,
  ) { }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      FirstName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      LastName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      MobileNo: ['', [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
    });
  }

  createPesonalForm1() {
    return this._formBuilder.group({
      executiveId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      // RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$"),
        this._FormvalidationserviceService.noWhitespaceValidator()
      ]],
      middleName: ['', [
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$"),
        this._FormvalidationserviceService.allowEmptyStringValidator()
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern("^[A-Za-z/() ]*$"),
        this._FormvalidationserviceService.noWhitespaceValidator()
      ]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
      this._FormvalidationserviceService.onlyNumberValidator()
      ]],
      emailid: [''],
      address: [''],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isActive: [true, [Validators.required]]
    });
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient1.DeleteData("CompanyEmployeInfo?Id=" + m_data.toString());
  }

  public bankMasterSave(Param: any) {
    if (Param.executiveId) {
      return this._httpClient1.PutData("CompanyEmployeInfo/" + Param.executiveId, Param);
    } else return this._httpClient1.PostData("CompanyEmployeInfo", Param);
  }

  public getCompanyEmpById(Id) {
    return this._httpClient1.GetData("CompanyEmployeInfo/" + Id);
  }
}
