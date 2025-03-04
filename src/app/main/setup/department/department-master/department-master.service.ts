import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class DepartmentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDepartmentForm();
        this.myformSearch = this.createSearchForm();
    }

    createDepartmentForm(): FormGroup {
        return this._formBuilder.group({
            DepartmentId: [""],
            DepartmentName: [""],
            IsDeleted: [true],
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

    public getDepartmentMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_M_DepartmentMaster", 
 
            param
        );
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }

    public departmentMasterInsert(employee) {
        return this._httpClient.post(
            "DepartMentMaster/DepartmentSave",
            employee
        );
    }

    public departmentMasterUpdate(employee) {
        return this._httpClient.post(
            "DepartMentMaster/DepartmentUpdate",
            employee
        );
    }

    populateForm(employee) {
        this.myform.patchValue(employee);
    }
}
