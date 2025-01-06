import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TariffMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createTariffForm();
        this.myformSearch = this.createSearchForm();
    }

    createTariffForm(): UntypedFormGroup {
        return this._formBuilder.group({
            tariffId: [0],
            tariffName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"]
        });
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            TariffNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createTariffForm();
    }
    
    // New code
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TarrifMaster?Id=" + m_data.toString());
    }

    public tariffMasterSave(Param: any, showLoader = true) {
        if (Param.tariffId) {
            return this._httpClient.PutData("TarrifMaster/" + Param.tariffId, Param, showLoader);
        } else return this._httpClient.PostData("TarrifMaster", Param, showLoader);
    }
}
