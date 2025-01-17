import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class StateMasterService {
    stateForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            countryId: [0, Validators.required],
            isActive:[true,[Validators.required]]
        });
    }

    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StateNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createStateForm();
    }

    getValidationMessages() {
        return {
           stateName: [
                { name: "required", Message: "State Name is required" },
                { name: "maxlength", Message: "State name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public stateMasterSave(Param: any, showLoader = true) {
        if (Param.stateId) {
            return this._httpClient.PutData("StateMaster/" + Param.stateId, Param, showLoader);
        } else return this._httpClient.PostData("StateMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StateMaster?Id=" + m_data.toString());
    }
}
