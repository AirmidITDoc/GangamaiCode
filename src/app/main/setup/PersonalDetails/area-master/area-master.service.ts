import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class AreaMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createAreaForm();
        this.myformSearch = this.createSearchForm();
    }

    createAreaForm(): FormGroup {
        return this._formBuilder.group({
            AreaId: [""],
            AreaName: [""],
            CityId: [""],
            CityName: [""],
            IsDeleted: [true],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            AreaNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createAreaForm();
    }

    public getAreaMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_AreaName_List",
            param
        );
    }

    // City Master Combobox List
    public getCityMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveCityMasterForCombo",
            {}
        );
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }
    public areaMasterInsert(param) {
        return this._httpClient.post("PersonalDetails/AreaSave", param);
    }

    public areaMasterUpdate(param) {
        return this._httpClient.post("PersonalDetails/AreaUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
