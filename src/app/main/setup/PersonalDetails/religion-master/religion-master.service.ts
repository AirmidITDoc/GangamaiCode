import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ReligionMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.CreateReligionForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ReligionNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    CreateReligionForm(): FormGroup {
        return this._formBuilder.group({
            religionId: [""],
            religionName: [""],
            isDeleted: [""],
            AddedBy: [""],
            UpdatedBy: [""],
        });
    }
    initializeFormGroup() {
        this.CreateReligionForm();
    }

    public getreligionMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("ReligionMaster/List", param, showLoader);
    }

    getValidationMessages() {
        return {
            religionName: [
                { name: "required", Message: "Religion Name is required" },
                { name: "maxlength", Message: "Religion name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public religionMasterSave(Param: any, showLoader = true) {
        if (Param.religionId) {
            return this._httpClient.PutData("ReligionMaster/" + Param.religionId, Param, showLoader);
        } else return this._httpClient.PostData("ReligionMaster", Param, showLoader);
    }

    
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ReligionMaster?Id=" + m_data.toString());
    }


    populateForm(param) {
        this.myform.patchValue(param);
    }
}
