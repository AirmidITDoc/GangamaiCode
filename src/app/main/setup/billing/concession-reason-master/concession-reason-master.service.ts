import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ConcessionReasonMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createConcessionreasonForm();
        this.myformSearch = this.createSearchForm();
    }
    
    createConcessionreasonForm(): FormGroup {
        return this._formBuilder.group({
            concessionId: [""],
            concessionReason: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ConcessionReasonNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createConcessionreasonForm();
    }
    getValidationMessages() {
        return {
            concessionReason: [
                { name: "required", Message: "Concession Name is required" },
                { name: "maxlength", Message: "Concession name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public concessionreasonMasterSave(Param: any, showLoader = true) {
        if (Param.concessionId) {
            return this._httpClient.PutData("ConcessionReasonMaster/" + Param.concessionId, Param, showLoader);
        } else return this._httpClient.PostData("ConcessionReasonMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ConcessionReasonMaster?Id=" + m_data.toString());
    }
}