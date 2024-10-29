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
            GroupId: [""],
            GroupName: ["", Validators.required],
            PrintSeqNo: ["", Validators.pattern("[0-9]+")],
            Isconsolidated: ["false"],
            IsConsolidatedDR: ["false"],
            IsActive: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
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

 
    public getgroupMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("GroupMaster/List", param, showLoader);
    }

    public groupMasterSave(Param: any, id: string ,showLoader = true) {
        if(id)
            return this._httpClient.PutData("group/"+ id, Param, showLoader);
        else
            return this._httpClient.PostData("group", Param, showLoader);       
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("bank", m_data);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
