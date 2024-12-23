import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class UomMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createUnitofmeasurementForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitofmeasurementForm(): FormGroup {
        return this._formBuilder.group({
            unitofMeasurementId: [0],
            unitofMeasurementName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            UnitofMeasurementSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createUnitofmeasurementForm();
    }
    getValidationMessages() {
        return {
            unitofMeasurementName: [
                { name: "required", Message: "Currency Name is required" },
                { name: "maxlength", Message: "Currency name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public unitMasterSave(Param: any, showLoader = true) {
        if (Param.unitofMeasurementId) {
            return this._httpClient.PutData("UnitOfMeasurement/" + Param.unitofMeasurementId, Param, showLoader);
        } else return this._httpClient.PostData("UnitOfMeasurement", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("UnitOfMeasurement?Id=" + m_data.toString());
    }

}