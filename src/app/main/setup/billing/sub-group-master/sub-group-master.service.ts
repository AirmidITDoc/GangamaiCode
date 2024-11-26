import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
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
            subGroupId: [""],
            subGroupName: [""],
            groupId: [""],
            //GroupName: [""],
            isDeleted: ["false"],
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

   
    getValidationMessages() {
        return {
            subGroupName: [
                { name: "required", Message: "SubGroup Name is required" },
                { name: "maxlength", Message: "SubGroup name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
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
