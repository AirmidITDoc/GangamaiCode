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
            templateDesc: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
            nursTempName: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
            category: ['0', [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    public templateMasterSave(Param: any) {
        if (Param.nursingId) {
            return this._httpClient.PutData("Nursing/NursingTemplateUpdate/" + Param.nursingId, Param);
        } else return this._httpClient.PostData("Nursing/NursingTemplateInsert", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Nursing/NursingTemplateCanel?Id=" + m_data.toString());
    }
}
