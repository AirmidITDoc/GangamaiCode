import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class MaritalstatusMasterService {
    myform: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createMaritalForm();
    }

    createMaritalForm(): FormGroup {
        return this._formBuilder.group({
            MaritalStatusId: [""],
            MaritalStatusName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createMaritalForm();
    }

    public getmaritalstatusMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_MaritalStatusMaster_by_Name",
            { MaritalStatusName: "%" }
        );
    }

    public insertMaritalStatusMaster(employee) {
        return this._httpClient.post(
            "PersonalDetails/MaritalStatusSave",
            employee
        );
    }

    public updateMaritalStatusMaster(employee) {
        return this._httpClient.post(
            "PersonalDetails/MaritalStatusUpdate",
            employee
        );
    }

    populateForm(employee) {
        this.myform.patchValue(employee);
    }
}
