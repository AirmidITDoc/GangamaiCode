import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ReligionMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        public _httpClient: HttpClient,
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

    public getReligionMasterList(e) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=M_Rtrv_ReligionName_by_Name",
            e
        );
    }

    public religionMasterInsert(param) {
        return this._httpClient.post(
            "PersonalDetails/ReligionMasterSave",
            param
        );
    }

    public religionMasterUpdate(param) {
        return this._httpClient.post(
            "PersonalDetails/ReligionMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
