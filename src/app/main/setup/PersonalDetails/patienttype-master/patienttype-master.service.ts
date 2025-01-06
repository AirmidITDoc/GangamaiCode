import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PatienttypeMasterService {
    myForm: UntypedFormGroup;
    myformSearch: UntypedFormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    )
    {
        this.myForm = this.createPatientTypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            PatientTypeSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createPatientTypeForm(): UntypedFormGroup {
        return this._formBuilder.group({
            patientTypeId: [0],
            patientType: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createPatientTypeForm();
    }
    
    

    public patienttypeMasterSave(Param: any, showLoader = true) {
        if (Param.patientTypeId) {
            return this._httpClient.PutData("PatientType/" + Param.patientTypeId, Param, showLoader);
        } else return this._httpClient.PostData("PatientType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PatientType?Id=" + m_data.toString());
    }
}
