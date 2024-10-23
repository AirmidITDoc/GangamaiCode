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
            PatientTypeId: [""],
            PatientType: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createPatientTypeForm();
    }

    public getPatienttypeMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("Gender/List", param, showLoader);
    }

    public PatienttypeMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("Patienttype", Param, showLoader);
    }

    public PatienttypeMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("Patienttype", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Patienttype", m_data);
    }

    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
