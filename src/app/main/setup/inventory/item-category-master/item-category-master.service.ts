import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class ItemCategoryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createItemCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemCategoryForm(): FormGroup {
        return this._formBuilder.group({
            ItemCategoryId: [""],
            ItemCategoryName: [""],
            ItemTypeID: [""],
            ItemTypeName: [""],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemCategoryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createItemCategoryForm();
    }

    public getitemcategoryMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_ItemCategoryMaster_by_Name",
            param
        );
    }

    public getItemTypeMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_ItemTypeMasterForCombo",
            {}
        );
    }

    public insertItemCategoryMaster(param) {
        return this._httpClient.post("Inventory/ItemCategorySave", param);
    }

    public updateItemCategoryMaster(param) {
        return this._httpClient.post("Inventory/ItemCategoryUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
