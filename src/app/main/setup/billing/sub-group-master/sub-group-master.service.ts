import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class SubGroupMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
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
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            groupId: ["",
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            isActive:[true,[Validators.required]]
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

    public SubGroupMasterSave(Param: any) {
        if (Param.subGroupId) {
            return this._httpClient.PutData("SubGroupMaster/" + Param.subGroupId, Param);
        } else return this._httpClient.PostData("SubGroupMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubGroupMaster?Id=" + m_data.toString());
    }
}
