import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class UnitmasterService {
    currentStatus = 0
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createUnitmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitmasterForm(): FormGroup {
        return this._formBuilder.group({
            UnitId: [""],
            UnitName: [""],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            UnitNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createUnitmasterForm();
    }

    public getUnitMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("PathUnitMaster/List", param, showLoader);
    }

    public UnitMasterSave(Param: any, id: string ,showLoader = true) {
        if(id)
            return this._httpClient.PutData("Unit/"+ id, Param, showLoader);
        else
            return this._httpClient.PostData("Unit", Param, showLoader);       
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("Unit", m_data);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
