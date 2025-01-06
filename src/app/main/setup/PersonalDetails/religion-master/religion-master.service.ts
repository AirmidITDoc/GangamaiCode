import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ReligionMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.CreateReligionForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            ReligionNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    CreateReligionForm(): UntypedFormGroup {
        return this._formBuilder.group({
            religionId: [0],
            religionName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
        });
    }
    initializeFormGroup() {
        this.CreateReligionForm();
    }

    public getreligionMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("ReligionMaster/List", param, showLoader);
    }

    public religionMasterSave(Param: any, showLoader = true) {
        if (Param.religionId) {
            return this._httpClient.PutData("ReligionMaster/" + Param.religionId, Param, showLoader);
        } else return this._httpClient.PostData("ReligionMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ReligionMaster?Id=" + m_data.toString());
    }

}
