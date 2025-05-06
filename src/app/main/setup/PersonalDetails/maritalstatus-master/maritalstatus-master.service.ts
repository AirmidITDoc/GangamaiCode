import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class MaritalstatusMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }

    initializeFormGroup() {
        this.createMaritalForm();
    }

  

    public MaritalStatusMasterSave(Param: any) {
        if (Param.maritalStatusId) {
            return this._httpClient.PutData("MaritalStatus/" + Param.maritalStatusId, Param);
        } else return this._httpClient.PostData("MaritalStatus", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("MaritalStatus?Id=" + m_data.toString());
    }
}
