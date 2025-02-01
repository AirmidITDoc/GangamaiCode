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
            IsDeleted: [true],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
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
            "Generic/GetByProc?procName=m_Rtrv_TalukaNameList_by_Name",
            param
        );
    }

    public getCityList() {
        return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
      }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
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
