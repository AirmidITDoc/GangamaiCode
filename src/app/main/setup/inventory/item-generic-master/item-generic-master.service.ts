import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
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
                genericId: [0],
                genericName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: false,
            isActive:[true,[Validators.required]]
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
        if (Param.genericId) {
            return this._httpClient.PutData("GenericMaster/" + Param.genericId, Param);
        } else return this._httpClient.PostData("GenericMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("GenericMaster?Id=" + m_data.toString());
    }
}
