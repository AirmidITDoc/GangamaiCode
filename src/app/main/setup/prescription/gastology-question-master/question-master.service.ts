import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionMasterService {
 QuestionForm: FormGroup;
  
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.QuestionForm = this.createquestionForm();
            }

    createquestionForm(): FormGroup {
        return this._formBuilder.group({
           questionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            questionName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            shortCutValues: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]],
            // isActive: [true, [Validators.required]],
           
        });
    }
  
    initializeFormGroup() {
        this.createquestionForm();
    }

  
    public questionMasterSave(Param: any) {
        if (Param.questionId) {
            return this._httpClient.PutData("QuestionMaster/" + Param.questionId, Param);
        } else return this._httpClient.PostData("QuestionMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("QuestionMaster?Id=" + m_data.toString());
    }
}
