import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CategoryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createCategoryForm(): FormGroup {
        return this._formBuilder.group({
            categoryId: [""],
            categoryName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
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

    getValidationMessages() {
        return {
            categoryName: [
                { name: "required", Message: "Category Name is required" },
                { name: "maxlength", Message: "Category name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public categoryMasterSave(Param: any, showLoader = true) {
        if (Param.categoryId) {
            return this._httpClient.PutData("PathCategoryMaster/" + Param.categoryId, Param, showLoader);
        } else return this._httpClient.PostData("PathCategoryMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PathCategoryMaster?Id=" + m_data.toString());
    }
}