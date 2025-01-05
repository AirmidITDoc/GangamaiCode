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
            id: [0],
            taxNature: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            IsDeleted: ["false"],
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

    public taxMasterSave(Param: any, showLoader = true) {
        if (Param.id) {
            return this._httpClient.PutData("TaxMaster/" + Param.id,Param,showLoader);
        } else return this._httpClient.PostData("TaxMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TaxMaster?Id=" + m_data.toString());
    }
}
