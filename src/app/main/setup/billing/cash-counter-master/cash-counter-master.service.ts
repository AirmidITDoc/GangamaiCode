import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
            cashCounterName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            prefix: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            billNo: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$")
                ]
            ],
           isActive: ["true"],
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
                { name: "required", Message: "CashCounter Name is required" },
                { name: "maxlength", Message: "CashCounter name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            prefix: [
                { name: "required", Message: "Prefix Name is required" },
                { name: "maxlength", Message: "Prefix name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            billNo: [
                { name: "required", Message: "BillNo Name is required" },
                { name: "maxlength", Message: "BillNo name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed, only digits." }
            ],

        };
    }

    public cashcounterMasterSave(Param: any, showLoader = true) {
        if (Param.cashCounterId) {
            return this._httpClient.PutData("CashCounter/" + Param.cashCounterId, Param, showLoader);
        } else return this._httpClient.PostData("CashCounter", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CashCounter?Id=" + m_data.toString());
    }
}
