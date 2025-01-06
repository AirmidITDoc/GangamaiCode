import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ConcessionReasonMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createConcessionreasonForm();
        this.myformSearch = this.createSearchForm();
    }
    
    createConcessionreasonForm(): UntypedFormGroup {
        return this._formBuilder.group({
            concessionId: [0],
            concessionReason: ["", 
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            // isActive: ["true"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
        });
    }
    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            ConcessionReasonNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createConcessionreasonForm();
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