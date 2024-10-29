import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class CategorymasterService {
    currentStatus = 0;
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
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

    
    public getCategoryMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("PathCategoryMaster/List", param, showLoader);
    }

    public CategoryMasterSave(Param: any, id: string ,showLoader = true) {
        if(id)
            return this._httpClient.PutData("Category/"+ id, Param, showLoader);
        else
            return this._httpClient.PostData("Category", Param, showLoader);       
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("Category", m_data);
    }
    populateForm(param) {
        debugger
        this.myform.patchValue(param);
    }
}
