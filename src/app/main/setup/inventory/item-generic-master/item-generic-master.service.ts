import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemGenericMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemgenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemgenericForm(): UntypedFormGroup {
        return this._formBuilder.group({
                genericId: [0],
                genericName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: ["false"],
        });
    }
    
    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            ItemGenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createItemgenericForm();
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
