import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceTariffViewService {

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  createnewServiceSearchForm(): FormGroup {
    return this._formBuilder.group({
      searchServiceName: ['', [Validators.pattern('^[a-zA-Z () ]*$')]],
      searchTariffName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  // public getServicesNew(id, param) {
  //   return this._httpClient.GetData("BillingService/GetServicesNew?TariffId=" + id + "&ServiceName=" + param);
  // }

  public getServicesNew(id: number, param: string, pageIndex: number = 0, pageSize: number = 25) {
    return this._httpClient.GetData(
      "BillingService/GetServicesNew?TariffId=" + id +
      "&ServiceName=" + param +
      "&PageIndex=" + pageIndex +
      "&PageSize=" + pageSize
    );
  }
}
