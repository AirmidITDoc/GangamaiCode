import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class MaritalstatusMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createMaritalForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            MaritalStatusNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createMaritalForm(): FormGroup {
        return this._formBuilder.group({
            MaritalStatusId: [""],
            MaritalStatusName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createMaritalForm();
    }

   
    public getMaritalStatusList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("MaritalStatus/List", param, showLoader);
    }

    public MaritalStatusMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("MaritalStatus", Param, showLoader);
    }

    public MaritalStatusMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("MaritalStatus", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("MaritalStatus", m_data);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
