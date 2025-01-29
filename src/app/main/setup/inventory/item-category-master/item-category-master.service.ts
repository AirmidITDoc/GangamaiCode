import { Injectable } from "@angular/core";
import { validateBasis } from "@angular/flex-layout";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemCategoryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemCategoryForm(): FormGroup {
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
            isActive:[true,[Validators.required]]
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

    public categoryMasterSave(Param: any) {
        if (Param.itemCategoryId) {
            return this._httpClient.PutData("ItemCategoryMaster/" + Param.itemCategoryId, Param);
        } else return this._httpClient.PostData("ItemCategoryMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemCategoryMaster?Id=" + m_data.toString());
    }
}
