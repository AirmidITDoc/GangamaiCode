import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrefixMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
     
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createPrefixForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            PrefixNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createPrefixForm(): FormGroup {
        return this._formBuilder.group({
            prefixId: [""],
            prefixName: [""],
            // SexID: [" "],
            // GenderName: [""],
            isActive: [""],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    initializeFormGroup() {
        this.createPrefixForm();
    }
  

    public getPrefixMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("Prefix/List", param, showLoader);
    }


    public prefixMasterSave(Param: any, showLoader = true) {
        if (Param.prefixId) {
            return this._httpClient.PutData("Prefix/" + Param.prefixId, Param, showLoader);
        } else return this._httpClient.PostData("Prefix", Param, showLoader);
    }

    getValidationMessages() {
        return {
            prefixName: [
                { name: "required", Message: "Prefix Name is required" },
                { name: "maxlength", Message: "Prefix name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }


    populateForm(param) {
        this.myform.patchValue(param);
    }


    public deactivateTheStatus(m_data) {
      return this._httpClient.DeleteData("Prefix?Id=" + m_data.toString());
    }
}
