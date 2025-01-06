import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class UnitmasterService {
    currentStatus = 0
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createUnitmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitmasterForm(): UntypedFormGroup {
        return this._formBuilder.group({
            unitId: [0],
            unitName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
        });
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            UnitNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createUnitmasterForm();
    }

    public unitMasterSave(Param: any, showLoader = true) {
        if (Param.unitId) {
            return this._httpClient.PutData("PathUnitMaster/" + Param.unitId, Param, showLoader);
        } else return this._httpClient.PostData("PathUnitMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PathUnitMaster?Id=" + m_data.toString());
    }
}

