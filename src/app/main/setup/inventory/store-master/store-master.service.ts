import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class StoreMasterService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createStoremasterForm();
    }

    createStoremasterForm(): FormGroup {
        return this._formBuilder.group({
            storeId: [""],
            storeShortName: [""],
            storeName: [""],
            indentPrefix: [""],
            indentNo: [""],
            purchasePrefix: [""],  
            purchaseNo: [""],
            grnPrefix: [""],  
            grnNo: [""],
            grnreturnNoPrefix: [""],
            grnreturnNo: [""],
            issueToDeptPrefix: [""],
            issueToDeptNo: [""],
            returnFromDeptNoPrefix: [""],
            returnFromDeptNo: [""],
            isDeleted: ["true"],
            UpdatedBy: [""],
            AddedByName: [""],
            Header:[""],
            PahsalesCashCounterID:[""],
            PahsalesrecCashCounterID:[""],
            PahsalesreturnCashCounterID:[""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createStoremasterForm();
    }

    getValidationMessages() {
        return {
            storeName: [
                { name: "required", Message: "storeName  is required" },
                { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public storeMasterSave(Param: any, showLoader = true) {
        if (Param.currencyId) {
            return this._httpClient.PutData("StoreMaster/" + Param.currencyId, Param, showLoader);
        } else return this._httpClient.PostData("StoreMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("StoreMaster", m_data);
    }
}