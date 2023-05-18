import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class UnitmasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createUnitmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitmasterForm(): FormGroup {
        return this._formBuilder.group({
            UnitId: [""],
            UnitName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            UnitNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createUnitmasterForm();
    }

    public getUnitMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_PathUnitMaster_by_Name",
            { UnitName: "%" }
        );
    }

    public insertUnitMaster(param) {
        return this._httpClient.post("Pathology/UnitSave", param);
    }

    public updateUnitMaster(param) {
        return this._httpClient.post("Pathology/UnitUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
