import { Injectable } from "@angular/core";
import { validateBasis } from "@angular/flex-layout";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemCategoryMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemCategoryForm(): UntypedFormGroup {
        return this._formBuilder.group({
            itemCategoryId: [0],
            itemCategoryName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            itemTypeId: ["",
                Validators.required
            ],
        });
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            ItemCategoryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createItemCategoryForm();
    }

    public categoryMasterSave(Param: any, showLoader = true) {
        if (Param.itemCategoryId) {
            return this._httpClient.PutData("ItemCategoryMaster/" + Param.itemCategoryId, Param, showLoader);
        } else return this._httpClient.PostData("ItemCategoryMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemCategoryMaster?Id=" + m_data.toString());
    }
}
