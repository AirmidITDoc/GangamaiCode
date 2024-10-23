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
            Id: [""],
            DoctorType: [""],
            isActive: ['1'],
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

  
    public doctorTypeMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("doctorType", Param, showLoader);
    }

    public doctorTypeMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("doctorType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("doctorType", m_data);
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
