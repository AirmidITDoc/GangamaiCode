import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class LocationMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createLocationForm();
        this.myformSearch = this.createSearchForm();
    }

    createLocationForm(): FormGroup {
        return this._formBuilder.group({
            locationId: [""],
            locationName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            LocationNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createLocationForm();
    }

    getValidationMessages() {
        return {
            locationName: [
                { name: "required", Message: "LocationName  is required" },
                { name: "maxlength", Message: "LocationName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public locationMasterSave(Param: any, showLoader = true) {
        if (Param.locationId) {
            return this._httpClient.PutData("LocationMaster/" + Param.locationId, Param, showLoader);
        } else return this._httpClient.PostData("LocationMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("LocationMaster?Id=" + m_data.toString());
    }
}
