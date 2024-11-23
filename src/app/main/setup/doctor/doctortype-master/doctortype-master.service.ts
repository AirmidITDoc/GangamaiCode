import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DoctortypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDoctortypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createDoctortypeForm(): FormGroup {
        return this._formBuilder.group({
            id: [""],
            doctorType: [""],
            isDeleted: ['1'],
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

  
  
    getValidationMessages() {
        return {
            doctorType: [
                { name: "required", Message: "DoctorType Name is required" },
                { name: "maxlength", Message: "DoctorType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public doctortypeMasterSave(Param: any, showLoader = true) {
        if (Param.id) {
            return this._httpClient.PutData("DoctorTypeMaster/" + Param.id, Param, showLoader);
        } else return this._httpClient.PostData("DoctorTypeMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("DoctorTypeMaster/", m_data);
    }
}