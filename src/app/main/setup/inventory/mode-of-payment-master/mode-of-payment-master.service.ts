import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ModeOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createModeofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createModeofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            Id: [""],
            ModeOfPayment: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ModeOfPaymentSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createModeofpaymentForm();
    }

    public getModeofpaymentMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_ModeOfPaymentList_by_Name",
            param
        );
    }

    public insertModeofPaymentMaster(param) {
        return this._httpClient.post("Inventory/ModeofPaymentSave", param);
    }

    public updateModeofPaymentMaster(param) {
        return this._httpClient.post("Inventory/ModeofPaymentUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
