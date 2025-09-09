import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


@Injectable({
  providedIn: 'root'
})
export class NursingMasterService {

  myform: FormGroup;
  Templateform: FormGroup

  constructor(public _httpClient: ApiCaller,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _formBuilder: UntypedFormBuilder) {
    this.Templateform = this.templateForm();
  }

  templateForm(): FormGroup {
    return this._formBuilder.group({
      nursingId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      templateDesc: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      nursTempName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
      addedBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      updatedBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  public templateMasterSave(Param: any) {
        return this._httpClient.PostData("Nursing/NursingTemplateInsert", Param);
    }
}
