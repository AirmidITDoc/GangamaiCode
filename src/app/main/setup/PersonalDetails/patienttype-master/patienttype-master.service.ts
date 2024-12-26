import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PatienttypeMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    )
    {
        this.myForm = this.createPatientTypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            PatientTypeSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    createPatientTypeForm(): FormGroup {
        return this._formBuilder.group({
            patientTypeId: [""],
            patientType: ["",
                [
                    Validators.required,Validators.maxLength(50),
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
