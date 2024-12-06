import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
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
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createUnitmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitmasterForm(): FormGroup {
        return this._formBuilder.group({
            unitId: [""],
            unitName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            // isDeleted: ["true"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
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

    
    getValidationMessages() {
        return {
            unitName: [
                { name: "required", Message: "Unit Name is required" },
                { name: "maxlength", Message: "Unit name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public unitMasterSave(Param: any, showLoader = true) {
        if (Param.unitId) {
            return this._httpClient.PutData("PathUnitMaster/" + Param.unitId, Param, showLoader);
        } else return this._httpClient.PostData("PathUnitMaster", Param, showLoader);
    }

    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.PostData("PathUnitMaster", m_data);
    // }
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PathUnitMaster?Id=" + m_data.toString());
    }
}

