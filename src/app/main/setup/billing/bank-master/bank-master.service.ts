
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class BankMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createBankForm();
        this.myformSearch = this.createSearchForm();
    }

    createBankForm(): FormGroup {
        return this._formBuilder.group({
            bankId: [0],
            bankName: ["", 
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BankNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createBankForm();
    }

    public getbankMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("BankMaster/List", param, showLoader);
    }

    public bankMasterSave(Param: any, showLoader = true) {
        if (Param.bankId) {
            return this._httpClient.PutData("BankMaster/" + Param.bankId, Param, showLoader);
        } else return this._httpClient.PostData("BankMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("BankMaster?Id=" + m_data.toString());
    }

}
