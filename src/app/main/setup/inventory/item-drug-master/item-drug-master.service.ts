import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";


@Injectable({
    providedIn: 'root'
})
export class ItemDrugMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createItemclassForm();
    }

    createItemclassForm(): FormGroup {
        return this._formBuilder.group({
            itemDrugTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            drugTypeName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    // Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive: [true, [Validators.required]]
        });
    }

    initializeFormGroup() {
        this.createItemclassForm();
    }

    public ItemDrugTypeMasterSave(Param: any) {
        if (Param.itemDrugTypeId) {
            return this._httpClient.PutData("ItemDrugTypeMaster/" + Param.itemDrugTypeId, Param);
        } else return this._httpClient.PostData("ItemDrugTypeMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemDrugTypeMaster?Id=" + m_data.toString());
    }
}
