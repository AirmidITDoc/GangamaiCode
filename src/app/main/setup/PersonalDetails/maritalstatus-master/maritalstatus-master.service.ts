import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class MaritalstatusMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createMaritalForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            MaritalStatusNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createMaritalForm(): FormGroup {
        return this._formBuilder.group({
            maritalStatusId: [0],
            maritalStatusName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
        });
    }

    initializeFormGroup() {
        this.createMaritalForm();
    }

  

    public MaritalStatusMasterSave(Param: any, showLoader = true) {
        if (Param.maritalStatusId) {
            return this._httpClient.PutData("MaritalStatus/" + Param.maritalStatusId, Param, showLoader);
        } else return this._httpClient.PostData("MaritalStatus", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("MaritalStatus?Id=" + m_data.toString());
    }
}
