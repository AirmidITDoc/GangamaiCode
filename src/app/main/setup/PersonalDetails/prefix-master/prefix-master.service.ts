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
            PrefixID: [""],
            PrefixName: [""],
            SexID: [" "],
            GenderName: [""],
            IsActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    initializeFormGroup() {
        this.createPrefixForm();
    }
  

    public getPrefixMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("Prefix/List", param, showLoader);
    }

    public insertPrefixMaster(Param: any, showLoader = true) {
        return this._httpClient.PostData("Prefix", Param, showLoader);
    }

    public updatePrefixMaster(id: number , Param: any, showLoader = true) {
        
        return this._httpClient.PostData("Prefix", Param, showLoader);
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }


    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Prefix", m_data);
    }
}
