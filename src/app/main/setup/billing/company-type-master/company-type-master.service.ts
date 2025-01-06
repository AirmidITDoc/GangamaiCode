import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CompanyTypeMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createcompanytypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createcompanytypeForm(): UntypedFormGroup {
        return this._formBuilder.group({
            companyTypeId: [0],
            typeName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    
    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            TypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createcompanytypeForm();
    }

    public companytypeMasterSave(Param: any, showLoader = true) {
        if (Param.companyTypeId) {
            return this._httpClient.PutData("CompanyTypeMaster/" + Param.companyTypeId, Param, showLoader);
        } else return this._httpClient.PostData("CompanyTypeMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CompanyTypeMaster?Id=" + m_data.toString());
    }
}
