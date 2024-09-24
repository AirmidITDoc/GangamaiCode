import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "app/core/http/http.service";
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
        this.myform = this.createGenderForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenderNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createGenderForm(): FormGroup {
        return this._formBuilder.group({
            GenderId: [""],
            GenderName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z () ]*$')
              ]],
            IsDeleted: [""],
        });
    }

    initializeFormGroup() {
        this.createGenderForm();
    }

    populateForm(Param) {
        this.myform.patchValue(Param);
    }



    public getGenderMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("Gender/List", param, showLoader);
    }

    public genderMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("Gender", Param, showLoader);
    }

    public genderMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("Gender", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Gender", m_data);
    }
}
