import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CountryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCountryForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CountryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    createCountryForm(): FormGroup {
        return this._formBuilder.group({
            countryId: [0],
            countryName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            // isActive: ["true"],
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
