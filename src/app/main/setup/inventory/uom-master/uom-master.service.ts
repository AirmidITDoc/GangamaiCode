import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class UomMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createUnitofmeasurementForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitofmeasurementForm(): FormGroup {
        return this._formBuilder.group({
            unitofMeasurementId: [0],
            unitofMeasurementName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive:[true,[Validators.required]]
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
    

    public unitMasterSave(Param: any, showLoader = true) {
        if (Param.unitofMeasurementId) {
            return this._httpClient.PutData("UnitOfMeasurement/" + Param.unitofMeasurementId, Param, showLoader);
        } else return this._httpClient.PostData("UnitOfMeasurement", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("UnitOfMeasurement?Id=" + m_data.toString());
    }

}