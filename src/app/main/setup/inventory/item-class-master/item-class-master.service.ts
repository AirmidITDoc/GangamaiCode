import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemClassMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemclassForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemclassForm(): FormGroup {
        return this._formBuilder.group({
            itemClassId: [0],
            itemClassName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemClassNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createItemclassForm();
    }

    public itemclassMasterSave(Param: any, showLoader = true) {
        if (Param.itemClassId) {
            return this._httpClient.PutData("ItemClassMaster/" + Param.itemClassId, Param, showLoader);
        } else return this._httpClient.PostData("ItemClassMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemClassMaster?Id=" + m_data.toString());
    }
}
