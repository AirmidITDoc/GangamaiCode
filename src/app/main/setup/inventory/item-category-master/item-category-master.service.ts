import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemCategoryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createItemCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemCategoryForm(): FormGroup {
        return this._formBuilder.group({
            itemCategoryId: [""],
            itemCategoryName: [""],
            itemTypeId: [""],
            // ItemTypeName: [""],
            // IsDeleted: ["true"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
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

    getValidationMessages() {
        return {
            itemCategoryName: [
                { name: "required", Message: "Category Name is required" },
                { name: "maxlength", Message: "Category name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public categoryMasterSave(Param: any, showLoader = true) {
        if (Param.itemCategoryId) {
            return this._httpClient.PutData("ItemCategoryMaster/" + Param.itemCategoryId, Param, showLoader);
        } else return this._httpClient.PostData("ItemCategoryMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("ItemCategoryMaster", m_data);
    }
}
