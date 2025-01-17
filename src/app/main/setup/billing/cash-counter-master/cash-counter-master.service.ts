import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CashCounterMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createcashcounterForm();
        this.myformSearch = this.createSearchForm();
    }

    createcashcounterForm(): FormGroup {
        return this._formBuilder.group({
            cashCounterId: [0],
            cashCounterName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            prefix: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            billNo: ["", 
                [
                    Validators.required, 
                    Validators.pattern("^[0-9]*$")
                ]
            ],
            isActive:[false,[Validators.required]]
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

    public cashcounterMasterSave(Param: any, showLoader = true) {
        if (Param.cashCounterId) {
            return this._httpClient.PutData("CashCounter/" + Param.cashCounterId, Param, showLoader);
        } else return this._httpClient.PostData("CashCounter", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CashCounter?Id=" + m_data.toString());
    }
    
}
