import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TaxMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createTaxMasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createTaxMasterForm(): FormGroup {
        return this._formBuilder.group({
            Id: [""],
            TaxNature: ["",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TaxNatureSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createTaxMasterForm();
    }

    getValidationMessages() {
        return {
            taxNature: [
                { name: "required", Message: "TaxNature Name is required" },
                { name: "maxlength", Message: "TaxNature name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public taxMasterSave(Param: any, showLoader = true) {
        if (Param.Id) {
            return this._httpClient.PutData("TaxMaster/" + Param.Id, Param, showLoader);
        } else return this._httpClient.PostData("TaxMaster", Param, showLoader);
    }
    
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TaxMaster?Id=" + m_data.toString());
    }
    
}
