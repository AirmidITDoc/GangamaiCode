import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CashCounterMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
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

  

    
    public getcashcounterMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("CashCounter/List", param, showLoader);
    }

    public cashcounterMasterSave(Param: any, id: string ,showLoader = true) {
        if(id)
            return this._httpClient.PutData("cashcounter/"+ id, Param, showLoader);
        else
            return this._httpClient.PostData("cashcounter", Param, showLoader);       
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("cashcounter", m_data);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
