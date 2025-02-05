import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class GroupMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createGroupForm();
        this.myformSearch = this.createSearchForm();
    }

    createGroupForm(): FormGroup {
        return this._formBuilder.group({
            groupId: [0],
            groupName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z\s]+$")
                ]
            ],
            isconsolidated: true,
            isActive:[true,[Validators.required]]
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

    public GroupMasterSave(Param: any) {
        if (Param.groupId) {
            return this._httpClient.PutData("GroupMaster/" + Param.groupId, Param);
        } else return this._httpClient.PostData("GroupMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("GroupMaster?Id=" + m_data.toString());
    }
}