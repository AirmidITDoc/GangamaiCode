import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CashCounterMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createcashcounterForm();
        this.myformSearch = this.createSearchForm();
    }

    createcashcounterForm(): FormGroup {
        return this._formBuilder.group({
            cashCounterId: [""],
            cashCounterName: [""],
            prefix: [""],
            billNo: [""],
           // isDeleted: ["false"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CashCounterNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createcashcounterForm();
    }

  
    getValidationMessages() {
        return {
            cashCounterName: [
                { name: "required", Message: "cashCounter Name is required" },
                { name: "maxlength", Message: "cashCounter name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public cashcounterMasterSave(Param: any, showLoader = true) {
        if (Param.cashCounterId) {
            return this._httpClient.PutData("CashCounter/" + Param.cashCounterId, Param, showLoader);
        } else return this._httpClient.PostData("CashCounter", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("CashCounter", m_data);
    }
}
