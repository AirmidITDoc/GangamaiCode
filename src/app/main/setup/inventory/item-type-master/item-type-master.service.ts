
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemTypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemtypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemtypeForm(): FormGroup {
        return this._formBuilder.group({
            itemTypeId: [0],
            itemTypeName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            isDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive:[true,[Validators.required]]
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

    public itemtypeMasterSave(Param: any, showLoader = true) {
        if (Param.itemTypeId) {
            return this._httpClient.PutData("ItemType/" + Param.itemTypeId, Param, showLoader);
        } else return this._httpClient.PostData("ItemType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemType?Id=" + m_data.toString());
    }
}