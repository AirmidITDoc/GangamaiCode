import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class CategorymasterService {
    currentStatus = 0;
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createCategorymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCategorymasterForm(): FormGroup {
        return this._formBuilder.group({
            categoryId: [0],
            categoryName: ["",
                [
                    Validators.required, Validators.maxLength(50),
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
            IsDeletedSearch: ["1"],
        });
    }

    initializeFormGroup() {
        this.createCategorymasterForm();
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