import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class TalukaMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myForm = this.createTalukaForm();
        this.myformSearch = this.createSearchForm();
    }

    createTalukaForm(): FormGroup {
        return this._formBuilder.group({
            talukaId: [0],
            talukaName: [0,
               [ Validators.required,
                Validators.pattern('^[a-zA-Z0-9 ]*$')
               ]
            ],
            cityId: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TalukaNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createTalukaForm();
    }

    public stateMasterSave(Param: any) {
        if (Param.talukaId) {
            return this._httpClient.PutData("TalukaMaster/" + Param.talukaId, Param);
        } else return this._httpClient.PostData("TalukaMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TalukaMaster?Id=" + m_data.toString());
    }

}
