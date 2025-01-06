import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CountryMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createCountryForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            CountryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    createCountryForm(): UntypedFormGroup {
        return this._formBuilder.group({
            countryId: [0],
            countryName: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
        });
    }

    initializeFormGroup() {
        this.createCountryForm();
    }

   

    public countryMasterSave(Param: any, showLoader = true) {
        if (Param.countryId) {
            return this._httpClient.PutData("CountryMaster/" + Param.countryId, Param, showLoader);
        } else return this._httpClient.PostData("CountryMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CountryMaster?Id=" + m_data.toString());
    }
}
