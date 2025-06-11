import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class CategorymasterService {
    currentStatus = 0;
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createCategorymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCategorymasterForm(): FormGroup {
        return this._formBuilder.group({
            categoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            categoryName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isDeleted: true,
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive: [true, [Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CategoryNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createCategorymasterForm();
    }

    public categoryMasterSave(Param: any) {
        if (Param.categoryId) {
            return this._httpClient.PutData("PathCategoryMaster/" + Param.categoryId, Param);
        } else return this._httpClient.PostData("PathCategoryMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PathCategoryMaster?Id=" + m_data.toString());
    }
}