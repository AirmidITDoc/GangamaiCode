import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantMastersService {

  constructor(public _httpClient: ApiCaller,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _formBuilder: UntypedFormBuilder) { }

  Form(): FormGroup {
    return this._formBuilder.group({
      constantId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      name: ['', [Validators.required]],
      value: ['', [Validators.required]],
      constantType: ['', [Validators.required]],
    });
  }

  public constantMasterSave(Param: any) {
    if (Param.constantId) {
      return this._httpClient.PutData("Constants/" + Param.constantId, Param);
    } else return this._httpClient.PostData("Constants", Param);
  }

  public getconstantType() {
    return this._httpClient.GetData("Constants/search-ConstantsType?Keyword=%");
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("Constants?Id=" + m_data.toString());
  }
}
