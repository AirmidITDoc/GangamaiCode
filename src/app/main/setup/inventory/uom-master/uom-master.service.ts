import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class UomMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createUnitofmeasurementForm();
        this.myformSearch = this.createSearchForm();
    }

    createUnitofmeasurementForm(): FormGroup {
        return this._formBuilder.group({
            unitofMeasurementId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitofMeasurementName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive: [true, [Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            UnitofMeasurementSearch: [""],
            IsDeletedSearch: [""],
        });
    }
    initializeFormGroup() {
        this.createUnitofmeasurementForm();
    }


    public unitMasterSave(Param: any) {
        if (Param.unitofMeasurementId) {
            return this._httpClient.PutData("UnitOfMeasurement/" + Param.unitofMeasurementId, Param);
        } else return this._httpClient.PostData("UnitOfMeasurement", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("UnitOfMeasurement?Id=" + m_data.toString());
    }

}