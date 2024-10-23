import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class GenericmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createGenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createGenericForm(): FormGroup {
        return this._formBuilder.group({
            GenericId: [""],
            GenericName: [""],

            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createGenericForm();
    }

  

    public getgenericMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("generic/List", param, showLoader);
    }

    public genericMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("generic", Param, showLoader);
    }

    public genericMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("generic/" + id , Param, showLoader);
        return this._httpClient.PostData("generic", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("generic?Id=" + m_data, {});
        return this._httpClient.PostData("generic", m_data);
    }
    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
