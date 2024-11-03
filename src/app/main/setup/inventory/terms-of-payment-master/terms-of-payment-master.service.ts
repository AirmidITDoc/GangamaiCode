import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TermsOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createtermsofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createtermsofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            Id: [""],
            TermsOfPayment: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TermsOfPaymentSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createtermsofpaymentForm();
    }

    getValidationMessages() {
        return {
            itemTypeName: [
                { name: "required", Message: "ItemType Name is required" },
                { name: "maxlength", Message: "ItemType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public termofpayMasterSave(Param: any, showLoader = true) {
        if (Param.itemTypeId) {
            return this._httpClient.PutData("ItemType/" + Param.itemTypeId, Param, showLoader);
        } else return this._httpClient.PostData("ItemType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("ItemType", m_data);
    }
}