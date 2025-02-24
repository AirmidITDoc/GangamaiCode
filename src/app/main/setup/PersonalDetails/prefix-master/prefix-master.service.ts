import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class PrefixMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
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
            IsDeleted: [true],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    initializeFormGroup() {
        this.createPrefixForm();
    }
    // get Perfix Master list
    public getPrefixMasterList(Param) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DB_PrefixMaster_by_Name", Param);
    }

    // Gender Master Combobox List
    public getGenderMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveGenderMasterForCombo",
            {}
        );
    }

    // Insert Perfix Master
    public insertPrefixMaster(Param) {
        return this._httpClient.post("PersonalDetails/PrefixSave", Param);
    }

    // Update Perfix Master
    public updatePrefixMaster(Param) {
        return this._httpClient.post("PersonalDetails/PrefixUpdate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
