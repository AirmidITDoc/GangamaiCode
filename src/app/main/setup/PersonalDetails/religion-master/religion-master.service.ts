import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ReligionMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.CreateReligionForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ReligionNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    CreateReligionForm(): FormGroup {
        return this._formBuilder.group({
            ReligionId: [""],
            ReligionName: [""],
            IsDeleted: ["false"],
            AddedBy: [""],
            UpdatedBy: [""],
        });
    }
    initializeFormGroup() {
        this.CreateReligionForm();
    }

    public getreligionMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("ReligionMaster/List", param, showLoader);
    }

    public religionMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("Religion", Param, showLoader);
    }

    public religionMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("Religion", Param, showLoader);
    }

      
    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Religion", m_data);
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
