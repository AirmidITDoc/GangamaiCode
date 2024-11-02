import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class AreaMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createAreaForm();
        this.myformSearch = this.createSearchForm();
    }

    createAreaForm(): FormGroup {
        return this._formBuilder.group({
            AreaId: [""],
            AreaName: [""],
            CityId: [""],
            CityName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            AreaNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createAreaForm();
    }

    getValidationMessages() {
        return {
            areaName: [
                { name: "required", Message: "Area Name is required" },
                { name: "maxlength", Message: "Area name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public AreaMasterSave(Param: any, showLoader = true) {
        if (Param.areaId) {
            return this._httpClient.PutData("AreaMaster/" + Param.areaId, Param, showLoader);
        } else return this._httpClient.PostData("AreaMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("AreaMaster", m_data);
    }
}
// Set NODE_OPTIONS="--max-old-space-size=8192"