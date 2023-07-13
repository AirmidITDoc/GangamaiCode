import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class BillingClassMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createClassForm();
        this.myformSearch = this.createSearchForm();
    }

    createClassForm(): FormGroup {
        return this._formBuilder.group({
            ClassId: [""],
            ClassName: [""],
            IsDeleted: ["false"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ClassNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createClassForm();
    }

    public getClassMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_ClassNameList_by_Name",
            param
        );
    }

    public classMasterInsert(param) {
        return this._httpClient.post("Billing/ClassSave", param);
    }

    public classMasterUpdate(param) {
        return this._httpClient.post("Billing/ClassUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
