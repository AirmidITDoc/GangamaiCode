import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class LocationMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createLocationForm();
        this.myformSearch = this.createSearchForm();
    }

    createLocationForm(): FormGroup {
        return this._formBuilder.group({
            LocationId: [""],
            LocationName: [""],
            IsDeleted: [true],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            LocationNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createLocationForm();
    }

    public getLocationMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_LocationMaster",
            param
        );
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }

    public locationMasterInsert(param) {
        return this._httpClient.post("DepartMentMaster/LocationSave", param);
    }

    public locationMasterUpdate(param) {
        return this._httpClient.post("DepartMentMaster/LocationtUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
