import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class SubquestionMasterService {
    SubQuestionForm: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) { }

    initializeFormGroup() {

    }


    public SubQuestionMasterSave(Param: any) {
        if (Param.subQuestionId) {
            return this._httpClient.PutData("SubQuestionMaster/Edit/" + Param.subQuestionId, Param);
        } else return this._httpClient.PostData("SubQuestionMaster/Insert", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubQuestionMaster?Id=" + m_data.toString());
    }

    public getSubresult(Param) {
        return this._httpClient.PostData("Common", Param)
    }
}
