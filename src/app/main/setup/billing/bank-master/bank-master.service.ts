import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createBankForm();
        this.myformSearch = this.createSearchForm();
    }

    createBankForm(): FormGroup {
        return this._formBuilder.group({
            BankId: [""],
            BankName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
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

    public bankMasterSave(Param: any, id: string ,showLoader = true) {
        if(id)
            return this._httpClient.PutData("bank/"+ id, Param, showLoader);
        else
            return this._httpClient.PostData("bank", Param, showLoader);       
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("bank", m_data);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
