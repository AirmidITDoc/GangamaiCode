import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ManufactureMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createManufactureForm();
        this.myformSearch = this.createSearchForm();
    }

    createManufactureForm(): FormGroup {
        return this._formBuilder.group({
            ManufId: [""],
            ManufName: [""],
            ManufShortName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ManufNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createManufactureForm();
    }

    public getmanufactureMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_ManufactureMaster_by_Name",
            { ManufName: "%" }
        );
    }

    public insertManufactureMaster(param) {
        return this._httpClient.post("Inventory/ManufactureSave", param);
    }

    public updateManufactureMaster(param) {
        return this._httpClient.post("Inventory/ManufactureUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
