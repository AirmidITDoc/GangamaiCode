import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class DoctortypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDoctortypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createDoctortypeForm(): FormGroup {
        return this._formBuilder.group({
            Id: [""],
            DoctorType: [""],
            IsDeleted: ["false"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorTypeSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDoctortypeForm();
    }

    public getDoctortypeMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_DoctorTypeMasteList_by_Name",param
           
        );
    }

    public doctortTypeMasterInsert(param) {
        return this._httpClient.post("DoctorMaster/DoctorTypeSave", param);
    }

    public doctorTypeMasterUpdate(param) {
        return this._httpClient.post("DoctorMaster/DoctorTypeUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
