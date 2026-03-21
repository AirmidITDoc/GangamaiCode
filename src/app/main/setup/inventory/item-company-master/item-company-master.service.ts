
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class ItemCompanyMasterService {

    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myformSearch = this.createSearchForm();
    }

    createItemCompanyForm(): FormGroup {
        return this._formBuilder.group({
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            companyName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            compShortName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive: [true, [Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemCompanyNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    public itemCompanyMasterSave(Param: any) {
        if (Param.companyId) {
            return this._httpClient.PutData("ItemCompanyMaster/" + Param.companyId, Param);
        } else return this._httpClient.PostData("ItemCompanyMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemCompanyMaster?Id=" + m_data.toString());
    }
}
