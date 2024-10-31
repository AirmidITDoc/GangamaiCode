import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class StateMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createStateForm();
        this.myformSearch = this.createSearchForm();
    }

    createStateForm(): FormGroup {
        return this._formBuilder.group({
            stateId: [""],
            stateName: [""],
            countryId: [""],
            countryName: [""],
            isDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
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
        return this._httpClient.PostData("StateMaster", m_data);
    }
}
