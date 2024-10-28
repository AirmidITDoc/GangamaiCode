import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class GenderMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenderNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    populateForm(Param) {
        this.myform.patchValue(Param);
    }

    public getGenderMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("Gender/List", param, showLoader);
    }

    public genderMasterSave(Param: any, id: string, showLoader = true) {
        if (id) {
            Param.genderId = id;
            return this._httpClient.PutData("Gender/" + id, Param, showLoader);
        } else return this._httpClient.PostData("Gender", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("Gender", m_data);
    }
}
