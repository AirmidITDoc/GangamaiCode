import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CashCounterMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createcashcounterForm();
        this.myformSearch = this.createSearchForm();
    }

    createcashcounterForm(): FormGroup {
        return this._formBuilder.group({
            CashCounterId: [""],
            CashCounterName: [""],
            Prefix: [""],
            BillNo: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
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

    public getCashcounterMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_CashCounterMaster_by_Name",
            { CashCounterName: "%" }
        );
    }

    public cashCounterMasterInsert(param) {
        return this._httpClient.post("Billing/CashCounterSave", param);
    }

    public cashCounterMasterUpdate(param) {
        return this._httpClient.post("Billing/CashCounterUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
