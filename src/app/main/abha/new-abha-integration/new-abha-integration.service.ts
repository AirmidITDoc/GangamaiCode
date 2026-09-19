import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewAbhaIntegrationService {

  Is9_Digit_National_Id: boolean = false;
  constructor(
    public _httpClient: HttpClient, public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private _loaderService: LoaderService,
    public _configue: ConfigService,
  ) {

  }

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
      CityId: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      AreaId: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
    });
  }

  public getDoctorsByDepartment(deptId) {
    return this._httpClient1.GetData("VisitDetail/DeptDoctorList?DeptId=" + deptId)
  }

  public getAbhaURL(Param) {
    return this._httpClient1.PostData("AbhaConnects/InitiateClient", Param);
  }
  public getAbhaTransactionIdList(Param) {
    return this._httpClient1.GetData("AbhaConnects/" + Param);
  }

  public getLastVisitDoctorList(param) {
    return this._httpClient1.PostData("VisitDetail/OPprevDoctorVisitList", param)
  }

  public getLastAdmissionDoctorList(param) {
    return this._httpClient1.PostData("Admission/IPprevDoctorVisitList", param)
  }

  public pushAbhaEncounterDet(param) {
    return this._httpClient1.PostData("AbhaConnects/GetPatientEncounterDetails", param)
  }

  public pushAbhaLinkCare(param) {
    return this._httpClient1.PostData("AbhaConnects/linkCareContext", param)
  }

  public getAbhaById(Id) {
    return this._httpClient1.GetData("PatientAbhaInformation/" + Id);
  }
  public getAbhaByNumber(Id) {
    return this._httpClient1.GetData("PatientAbhaInformation/ByAbhaNumber/" + Id);
  }
}
