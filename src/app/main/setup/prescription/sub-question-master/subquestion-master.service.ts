import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
    ) {
        this.SubQuestionForm = this.createSubQuestionForm();
    }

    createSubQuestionForm(): FormGroup {
        return this._formBuilder.group({
            subQuestionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            questionId:  [0, 
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            subQuestionName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            sequenceNo:  [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            resultValues:  ['', 
                [Validators.required,this._FormvalidationserviceService.allowEmptyStringValidator()]
            ],
            isActive: [true, [Validators.required]],

        });
    }

    initializeFormGroup() {
        this.createSubQuestionForm();
    }

    public getdepartmentMasterList(param) {
        return this._httpClient.PostData("DepartmentMaster/List", param);
    }

    public SubQuestionMasterSave(Param: any) {
        if (Param.subQuestionId) {
            return this._httpClient.PutData("SubQuestionMaster/" + Param.subQuestionId, Param);
        } else return this._httpClient.PostData("SubQuestionMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubQuestionMaster?Id=" + m_data.toString());
    }
}
