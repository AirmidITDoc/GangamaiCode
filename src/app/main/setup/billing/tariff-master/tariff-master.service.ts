import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TariffMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createTariffForm();
        this.myformSearch = this.createSearchForm();
    }

    /**
     * 
     * @returns {
  "tariffId": 0,
  "tariffName": "shilpa",
  "isActive": true
}

     */
    createTariffForm(): FormGroup {
        return this._formBuilder.group({
            tariffId: [0],
            tariffName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: true
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TariffNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createTariffForm();
    }
    
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TarrifMaster?Id=" + m_data.toString());
    }

    public tariffMasterSave(Param: any, showLoader = true) {
        if (Param.tariffId) {
            return this._httpClient.PutData("TarrifMaster/" + Param.tariffId, Param, showLoader);
        } else return this._httpClient.PostData("TarrifMaster", Param, showLoader);
    }
}
