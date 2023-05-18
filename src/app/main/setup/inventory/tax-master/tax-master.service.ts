import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class TaxMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createTaxMasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createTaxMasterForm(): FormGroup {
        return this._formBuilder.group({
            Id: [""],
            TaxNature: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
          TaxNatureSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createTaxMasterForm();
    }

    public gettaxMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_TaxNatureMaster_by_Name",
            { TaxNature: "%" }
        );
    }

    public insertTaxMaster(param) {
        return this._httpClient.post("Inventory/TaxSave", param);
    }

    public updateTaxMaster(param) {
        return this._httpClient.post("Inventory/TaxUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
