import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CurrencymasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCurrencyForm();
        this.myformSearch = this.createSearchForm();
    }

    createCurrencyForm(): FormGroup {
        return this._formBuilder.group({
            currencyId: [0],
            currencyName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: ["false"],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CurrencyNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    
    initializeFormGroup() {
        this.createCurrencyForm();
    }

    public currencyMasterSave(Param: any, showLoader = true) {
        if (Param.currencyId) {
            return this._httpClient.PutData("CurrencyMaster/" + Param.currencyId, Param, showLoader);
        } else return this._httpClient.PostData("CurrencyMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }

}
