import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CategoryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createCategoryForm(): FormGroup {
        return this._formBuilder.group({
            CategoryId: [""],
            CategoryName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CategoryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createCategoryForm();
    }

    public getCategoryMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_Radiology_CategoryMaster_by_Name",
            { CategoryName: "%" }
        );
    }

    public insertCategoryMaster(employee) {
        return this._httpClient.post("Radiology/CategorySave", employee);
    }

    public updateCategoryMaster(employee) {
        return this._httpClient.post("Radiology/CategoryUpdate", employee);
    }

    populateForm(employee) {
        this.myform.patchValue(employee);
    }
}
