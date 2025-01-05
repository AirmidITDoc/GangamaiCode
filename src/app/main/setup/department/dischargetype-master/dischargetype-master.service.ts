import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DischargetypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDischargetypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createDischargetypeForm(): FormGroup {
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

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DischargeTypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDischargetypeForm();
    }

    public getDischargeTypeMasterList(param: any, showLoader = true) {
        return this._httpClient.PostData("DischargeType/List", param, showLoader);
    }

    public dischargeTypeMasterSave(Param: any, showLoader = true) {
        if (Param.dischargeTypeId) {
            return this._httpClient.PutData("DischargeType/" + Param.dischargeTypeId, Param, showLoader);
        } else return this._httpClient.PostData("DischargeType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DischargeType?Id=" + m_data.toString());
    }
}
