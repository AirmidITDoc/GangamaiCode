import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DischargetypeMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createDischargetypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createDischargetypeForm(): UntypedFormGroup {
        return this._formBuilder.group({
            dischargeTypeId: [0],
            dischargeTypeName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            DischargeTypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDischargetypeForm();
    }

   

    // populateForm(Param) {
    //     this.myform.patchValue(Param);
    // }



    // public getDischargeTypeMasterList(param: gridRequest, showLoader = true) {
    //     return this._httpClient.PostData("DischargeType/List", param, showLoader);
    // }

    public dischargeTypeMasterSave(Param: any, showLoader = true) {
        if (Param.dischargeTypeId) {
            return this._httpClient.PutData("DischargeType/" + Param.dischargeTypeId, Param, showLoader);
        } else return this._httpClient.PostData("DischargeType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DischargeType?Id=" + m_data.toString());
    }
}
