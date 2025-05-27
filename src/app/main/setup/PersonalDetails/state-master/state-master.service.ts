import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class StateMasterService {
    stateForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        // this.stateForm = this.createStateForm();
        this.myformSearch = this.createSearchForm();
    }

    createStateForm(): FormGroup {
        return this._formBuilder.group({
            stateId: [0],
            stateName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            countryId: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isActive:[true,[Validators.required]]
        });
    }

    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StateNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createStateForm();
    }


    public stateMasterSave(Param: any) {
        if (Param.stateId) {
            return this._httpClient.PutData("StateMaster/" + Param.stateId, Param);
        } else return this._httpClient.PostData("StateMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StateMaster?Id=" + m_data.toString());
    }
}
