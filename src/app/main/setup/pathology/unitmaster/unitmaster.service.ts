import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class UnitmasterService {
    currentStatus = 0
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createUnitmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitmasterForm(): FormGroup {
        return this._formBuilder.group({
            unitId: [0],
            unitName: ["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            UnitNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createUnitmasterForm();
    }

    public unitMasterSave(Param: any) {
        if (Param.unitId) {
            return this._httpClient.PutData("PathUnitMaster/" + Param.unitId, Param);
        } else return this._httpClient.PostData("PathUnitMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PathUnitMaster?Id=" + m_data.toString());
    }
}

