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
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            isActive:[true,[Validators.required]]
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

    public categoryMasterSave(Param: any) {
        if (Param.categoryId) {
            return this._httpClient.PutData("RadiologyCategoryMaster/" + Param.categoryId, Param);
        } else return this._httpClient.PostData("RadiologyCategoryMaster", Param);
    }

    public deactivateTheStatus(Id:number) {
        return this._httpClient.DeleteData(`RadiologyCategoryMaster?Id=${Id}`);
    }
}