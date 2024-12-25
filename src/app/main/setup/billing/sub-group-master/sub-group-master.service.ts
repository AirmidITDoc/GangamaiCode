import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class SubGroupMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createSubgroupForm();
        this.myformSearch = this.createSearchForm();
    }

    createSubgroupForm(): FormGroup {
        return this._formBuilder.group({
            subGroupId: [0],
            subGroupName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            groupId: ["",
                Validators.required
            ],
            //GroupName: [""],
            isActive: ["true"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            SubGroupNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createSubgroupForm();
    }

    public SubGroupMasterSave(Param: any, showLoader = true) {
        if (Param.subGroupId) {
            return this._httpClient.PutData("SubGroupMaster/" + Param.subGroupId, Param, showLoader);
        } else return this._httpClient.PostData("SubGroupMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubGroupMaster?Id=" + m_data.toString());
    }
}
