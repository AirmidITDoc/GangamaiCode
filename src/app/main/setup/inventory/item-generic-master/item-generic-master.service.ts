
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemGenericMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createItemgenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemgenericForm(): FormGroup {
        return this._formBuilder.group({
          
                genericId: [""],
                genericName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: ["false"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemGenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createItemgenericForm();
    }
    getValidationMessages() {
        return {
            itemGenericName: [
                { name: "required", Message: "ItemGeneric Name is required" },
                { name: "maxlength", Message: "ItemGeneric name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public genericMasterSave(Param: any, showLoader = true) {
        if (Param.genericId) {
            return this._httpClient.PutData("GenericMaster/" + Param.genericId, Param, showLoader);
        } else return this._httpClient.PostData("GenericMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemGenericName?Id=" + m_data.toString());
    }
}
