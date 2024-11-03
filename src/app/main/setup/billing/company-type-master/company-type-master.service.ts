import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CompanyTypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createcompanytypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createcompanytypeForm(): FormGroup {
        return this._formBuilder.group({
            companyTypeId: [""],
            typeName: [""],
            isDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createcompanytypeForm();
    }

    getValidationMessages() {
        return {
            typeName: [
                { name: "required", Message: "Company type Name is required" },
                { name: "maxlength", Message: "Company type name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public companytypeMasterSave(Param: any, showLoader = true) {
        if (Param.companyTypeId) {
            return this._httpClient.PutData("CompanyTypeMaster/" + Param.companyTypeId, Param, showLoader);
        } else return this._httpClient.PostData("CompanyTypeMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("CompanyTypeMaster", m_data);
    }
}
