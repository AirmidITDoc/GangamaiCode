import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class TalukaMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createTalukaForm();
        this.myformSearch = this.createSearchForm();
    }

    createTalukaForm(): FormGroup {
        return this._formBuilder.group({
            TalukaId: [""],
            TalukaName: [""],
            CityName: [""],
            CityId: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TalukaNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createTalukaForm();
    }

    public getTalukaMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_TalukaNameList_by_Name",
            param
        );
    }

    public getCityMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_CityMasterForCombo",
            {}
        );
    }

    public talukaMasterInsert(param) {
        return this._httpClient.post("PersonalDetails/TalukaSave", param);
    }

    public talukaMasterUpdate(param) {
        return this._httpClient.post("PersonalDetails/TalukaUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
