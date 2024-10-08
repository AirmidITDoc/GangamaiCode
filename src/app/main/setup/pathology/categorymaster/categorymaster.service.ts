import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CategorymasterService {
    currentStatus = 0;
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCategorymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCategorymasterForm(): FormGroup {
        return this._formBuilder.group({
            CategoryId: [""],
            CategoryName: [""],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CategoryNameSearch: [""],
            IsDeletedSearch: ["1"],
        });
    }

    initializeFormGroup() {
        this.createCategorymasterForm();
    }

    public getCategoryMasterList(param) {
        return this._httpClient.post( "Generic/GetByProc?procName=m_Rtrv_PathCategoryList_by_Name",param);
    }

    public insertPathologyCategoryMaster(param) {
        return this._httpClient.post("PathologyMaster/PathologyCategoryMasterSave", param);
    }

    public updatePathologyCategoryMaster(param) {
        return this._httpClient.post("PathologyMaster/PathologyCategoryMasterUpdate",param);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
    }

    populateForm(param) {
        debugger
        this.myform.patchValue(param);
    }
}
