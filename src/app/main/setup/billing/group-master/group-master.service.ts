import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class GroupMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createGroupForm();
        this.myformSearch = this.createSearchForm();
    }

    createGroupForm(): FormGroup {
        return this._formBuilder.group({
            groupId: [""],
            groupName: ["", Validators.required],
            // printSeqNo: ["", Validators.pattern("[0-9]+")],
            // isconsolidated: ["false"],
            // isConsolidatedDR: ["false"],
            // isActive: ["false"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GroupNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createGroupForm();
    }

  
    getValidationMessages() {
        return {
            groupName: [
                { name: "required", Message: "Group Name is required" },
                { name: "maxlength", Message: "Group name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public GroupMasterSave(Param: any, showLoader = true) {
        if (Param.groupId) {
            return this._httpClient.PutData("GroupMaster/" + Param.groupId, Param, showLoader);
        } else return this._httpClient.PostData("GroupMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("GroupMaster?Id=" + m_data.toString());
    }
}