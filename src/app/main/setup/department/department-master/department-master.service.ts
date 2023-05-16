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
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
          DepartmentName: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createDepartmentForm();
    }

    public getDepartmentMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_M_DepartmentMaster_by_Name",
            { DepartmentName: "%" }
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
