import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
    createGenderForm() {
        return this._formBuilder.group({
            genderId: [""],
            genderName: ['', [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z () ]*$')
            ]],
            isDeleted: [""],
        });
    }
    getValidationMessages() {
        return {
            genderName: [
                { name: "required", Message: "Gender Name is required" },
                { name: "maxlength", Message: "Gender name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public genderMasterSave(Param: any, showLoader = true) {
        if (Param.genderId) {
            return this._httpClient.PutData("Gender/" + Param.genderId, Param, showLoader);
        } else return this._httpClient.PostData("Gender", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("Gender", m_data);
    }
}
