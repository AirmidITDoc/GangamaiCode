import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CurrencymasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCurrencyForm();
        this.myformSearch = this.createSearchForm();
    }

    createCurrencyForm(): FormGroup {
        return this._formBuilder.group({
            CurrencyId: [""],
            CurrencyName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
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

    public getCurrencyMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_CurrencyMaster_by_Name",
            param
        );
    }

    public insertCurrencyMaster(param) {
        return this._httpClient.post("Inventory/CurrencySave", param);
    }

    public updateCurrencyMaster(param) {
        return this._httpClient.post("Inventory/CurrencyUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
