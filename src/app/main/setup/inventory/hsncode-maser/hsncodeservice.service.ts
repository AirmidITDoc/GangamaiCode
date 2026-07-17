
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
@Injectable({
  providedIn: 'root'
})
export class HsncodeserviceService {
  myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createItemHsncodeForm();
        this.myformSearch = this.createSearchForm();
    }

    createItemHsncodeForm(): FormGroup {
        return this._formBuilder.group({
            hsncodeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            hsncodeName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    // Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            itemTypeId: ["",
                [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            isActive: [true, [Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            NameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createItemHsncodeForm();
    }

    public HsnccodeMasterSave(Param: any) {
        if (Param.itemCategoryId) {
            return this._httpClient.PutData("ItemCategoryMaster/" + Param.itemCategoryId, Param);
        } else return this._httpClient.PostData("ItemCategoryMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemCategoryMaster?Id=" + m_data.toString());
    }
}
