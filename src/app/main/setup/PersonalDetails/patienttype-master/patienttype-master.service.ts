import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class PatienttypeMasterService {
    myForm: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createPatientTypeForm();
    }

    createPatientTypeForm(): FormGroup {
        return this._formBuilder.group({
            PatientTypeId: [""],
            PatientType: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    initializeFormGroup() {
        this.createPatientTypeForm();
    }

    public getPatientTypeMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_M_PatientTypeMaster_by_Name",
            { PatientType: "%" }
        );
    }

    public patientTypeMasterInsert(param) {
        return this._httpClient.post("PersonalDetails/PatientTypeSave", param);
    }

    public patientTypeMasterUpdate(param) {
        return this._httpClient.post(
            "PersonalDetails/PatientTypeUpdate",
            param
        );
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
