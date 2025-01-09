import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CategoryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createCategoryForm();
        this.myformSearch = this.createSearchForm();
    }

    createCategoryForm(): FormGroup {
        return this._formBuilder.group({
            categoryId: [0],
            categoryName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: true,
            // AddedBy: [0],
            // UpdatedBy: [0],
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

    public categoryMasterSave(Param: any, showLoader = true) {
        if (Param.categoryId) {
            return this._httpClient.PutData("RadiologyCategoryMaster/" + Param.categoryId, Param, showLoader);
        } else return this._httpClient.PostData("RadiologyCategoryMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("RadiologyCategoryMaster?Id=" + m_data.toString());
    }
}