import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CurrencymasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
            isActive:[true,[Validators.required]]
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

    public currencyMasterSave(Param: any) {
        if (Param.currencyId) {
            return this._httpClient.PutData("CurrencyMaster/" + Param.currencyId, Param);
        } else return this._httpClient.PostData("CurrencyMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }

}
