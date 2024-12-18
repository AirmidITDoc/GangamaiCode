
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemTypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createItemtypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemtypeForm(): FormGroup {
        return this._formBuilder.group({
            itemTypeId: [""],
            itemTypeName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            isDeleted: ["true"],
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

    getValidationMessages() {
        return {
            itemTypeName: [
                { name: "required", Message: "ItemType Name is required" },
                { name: "maxlength", Message: "ItemType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public itemtypeMasterSave(Param: any, showLoader = true) {
        if (Param.itemTypeId) {
            return this._httpClient.PutData("ItemType/" + Param.itemTypeId, Param, showLoader);
        } else return this._httpClient.PostData("ItemType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemType?Id=" + m_data.toString());
    }
}