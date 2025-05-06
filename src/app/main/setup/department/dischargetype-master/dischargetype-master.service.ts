import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DischargetypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            IsDeleted: true,
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
            isActive:[true,[Validators.required]],
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

    public getDischargeTypeMasterList(param: any) {
        return this._httpClient.PostData("DischargeType/List", param);
    }

    public dischargeTypeMasterSave(Param: any) {
        if (Param.dischargeTypeId) {
            return this._httpClient.PutData("DischargeType/" + Param.dischargeTypeId, Param);
        } else return this._httpClient.PostData("DischargeType", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DischargeType?Id=" + m_data.toString());
    }
}
