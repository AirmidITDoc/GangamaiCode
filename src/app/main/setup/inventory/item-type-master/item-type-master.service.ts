import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ItemTypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createItemtypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemtypeForm(): FormGroup {
        return this._formBuilder.group({
            ItemTypeId: [""],
            ItemTypeName: [""],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemTypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createItemtypeForm();
    }

    public getItemtypeMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_ItemTypeMaster_by_Name",
            param
        );
    }

    public insertItemTypeMaster(param) {
        return this._httpClient.post("Inventory/ItemTypeSave", param);
    }

    public updateItemTypeMaster(param) {
        return this._httpClient.post("Inventory/ItemTypeUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
