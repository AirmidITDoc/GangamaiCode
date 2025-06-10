import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class GroupMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createGroupForm();
        this.myformSearch = this.createSearchForm();
    }

    createGroupForm(): FormGroup {
        return this._formBuilder.group({
            groupId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            groupName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                  //  Validators.pattern("^[A-Za-z\s]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isconsolidated: true,
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GroupNameSearch: [""],
            IsDeletedSearch: [""],
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