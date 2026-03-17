import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { first } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LabAppointmentService {

  myFilterform: FormGroup;
  MyForm: FormGroup;

  constructor(
    public _frombuilder: UntypedFormBuilder,
    public _httpClient: ApiCaller,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  public getPatientType(type) {
    return this._httpClient.GetData("LabPatientRegistration/GetMConstant?ConstantType=" + type);
  }
  public getLabRegistraionById(Id) {
    return this._httpClient.GetData("LabPatientRegistration/" + Id);
  }
  public getCompanyById(Id) {
    return this._httpClient.GetData("CompanyMaster/" + Id);
  }
  public getLabRegistraionMasterById(Id) {
    return this._httpClient.GetData("LabPatientRegistration/GetLabPatientRegisteredMaster?id=" + Id);
  }
  public getlabSuggestions(apiUrl: string, inputValue: string): Observable<any[]> {
    // debugger
    return this._httpClient.GetData(apiUrl + inputValue);
  }
  public getstateId(Id) {
    return this._httpClient.GetData("StateMaster/" + Id);
  }
  public getcityId(Id) {
    return this._httpClient.GetData("CityMaster/" + Id);
  }
  public getMaster(mode, Id) {
    return this._httpClient.GetData("Dropdown/GetBindDropDown?mode=" + mode + "&Id=" + Id);
  }
}
