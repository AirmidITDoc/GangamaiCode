import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class DrugmasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDrugForm();
        this.myformSearch = this.createSearchForm();
    }

    createDrugForm(): FormGroup {
        return this._formBuilder.group({
            DrugId: [""],
            DrugName: [""],
            GenericId: [""],
            GenericName: [""],
            ClassId: [""],
            ClassName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DrugNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDrugForm();
    }

    public getDrugMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_DrugMasterList_by_Name",
            { DrugName: "%" }
        );
    }

    // Generic Master Combobox List
    public getGenericMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_GenericListForCombo",
            {}
        );
    }

    // Class Master Combobox List
    public getClassMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_ClassListForCombo",
            {}
        );
    }

    public insertDrugMaster(param) {
        return this._httpClient.post("Prescription/DrugSave", param);
    }

    public updateDrugMaster(param) {
        return this._httpClient.post("Prescription/DrugUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
