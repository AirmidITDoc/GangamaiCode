import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CompanyTypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createcompanytypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createcompanytypeForm(): FormGroup {
        return this._formBuilder.group({
            CompanyTypeId: [""],
            TypeName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createcompanytypeForm();
    }

    public getCompanytypeMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_CompanyTypeMaster_by_Name",
            { TypeName: "%" }
        );
    }

    public companyTypeMasterInsert(param) {
        return this._httpClient.post(
            "/api/Billing/CompanyTypeMasterSave",
            param
        );
    }

    public companyTypeMasterUpdate(param) {
        return this._httpClient.post(
            "/api/Billing/CompanyTypeMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
