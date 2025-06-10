import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class TariffMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createTariffForm();
        this.myformSearch = this.createSearchForm();
    }

    createTariffForm(): FormGroup {
        return this._formBuilder.group({
            tariffId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            tariffName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TariffNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createTariffForm();
    }
    
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TarrifMaster?Id=" + m_data.toString());
    }

    public tariffMasterSave(Param: any) {
        if (Param.tariffId) {
            return this._httpClient.PutData("TarrifMaster/" + Param.tariffId, Param);
        } else return this._httpClient.PostData("TarrifMaster", Param);
    }
}
