import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class DepartmentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDepartmentForm();
        this.myformSearch = this.createSearchForm();
    }

    createDepartmentForm(): FormGroup {
        return this._formBuilder.group({
            departmentId: [""],
            departmentName: [""],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DepartmentNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createDepartmentForm();
    }

    public getdepartmentMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("DepartmentMaster/List", param, showLoader);
    }
    getValidationMessages() {
        return {
            departmentName: [
                { name: "required", Message: "Department Name is required" },
                { name: "maxlength", Message: "Department name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public departmentMasterSave(Param: any, showLoader = true) {
        if (Param.departmentId) {
            return this._httpClient.PutData("DepartmentMaster/" + Param.departmentId, Param, showLoader);
        } else return this._httpClient.PostData("DepartmentMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DepartmentMaster?Id=" + m_data.toString());
    }
}
