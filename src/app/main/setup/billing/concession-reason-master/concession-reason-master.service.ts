import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ConcessionReasonMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createConcessionreasonForm();
        this.myformSearch = this.createSearchForm();
    }

    createConcessionreasonForm(): FormGroup {
        return this._formBuilder.group({
            ConcessionId: [""],
            ConcessionReasonName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ConcessionReasonNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createConcessionreasonForm();
    }

    public getConcessionreasonMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_ConcessionReasonNameList_by_Name",
            param
        );
    }

    public consessionReasonMasterInsert(param) {
        return this._httpClient.post("Billing/ConsessionReasonSave", param);
    }

    public consessionReasonMasterUpdate(param) {
        return this._httpClient.post("Billing/ConsessionReasonUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
