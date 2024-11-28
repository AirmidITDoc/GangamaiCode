import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PatienttypeMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
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
            patientType: [""],
            isActive: [""],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createPatientTypeForm();
    }
    getValidationMessages() {
        return {
            patientType: [
                { name: "required", Message: "PatientType Name is required" },
                { name: "maxlength", Message: "PatientType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public patienttypeMasterSave(Param: any, showLoader = true) {
        if (Param.patientTypeId) {
            return this._httpClient.PutData("PatientType/" + Param.patientTypeId, Param, showLoader);
        } else return this._httpClient.PostData("PatientType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        // return this._httpClient.PostData("PatientType", m_data);
        return this._httpClient.DeleteData("PatientType?Id=" + m_data.toString());
    }
}
