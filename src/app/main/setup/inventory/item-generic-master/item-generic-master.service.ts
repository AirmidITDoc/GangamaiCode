import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemGenericMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemgenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemgenericForm(): FormGroup {
        return this._formBuilder.group({
            itemGenericNameId: [0],
            itemGenericName: ["",
                [
                    Validators.required, Validators.maxLength(250),
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: false,
            isActive: [true, [Validators.required]]
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

    public genericMasterSave(Param: any) {
        if (Param.itemGenericNameId) {
            return this._httpClient.PutData("GenericMaster/" + Param.itemGenericNameId, Param);
        } else return this._httpClient.PostData("GenericMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("GenericMaster?Id=" + m_data.toString());
    }
}
