import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class GenericmasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createGenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createGenericForm(): FormGroup {
        return this._formBuilder.group({
            GenericId: [""],
            GenericName: [""],

            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createGenericForm();
    }

    public getGenericMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_M_GenericMasterList_by_Name",
            param
        );
    }

    public insertGenericMaster(param) {
        return this._httpClient.post("Prescription/GenericSave", param);
    }

    public updateGenericMaster(param) {
        return this._httpClient.post("Prescription/GenericUpdate", param);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
