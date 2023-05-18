import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class DosemasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createDoseForm();
        this.myformSearch = this.createSearchForm();
    }

    createDoseForm(): FormGroup {
        return this._formBuilder.group({
            DoseId: [""],
            DoseName: [""],
            DoseNameInEnglish: [""],

            DoseQtyPerDay: [""],

            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoseNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDoseForm();
    }

    public getDoseMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_DoseNameList_by_Name",
            { DoseName: "%" }
        );
    }

    public insertDoseMaster(param) {
        return this._httpClient.post("Prescription/DoseSave", param);
    }

    public updateDoseMaster(param) {
        return this._httpClient.post("Prescription/DoseUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
