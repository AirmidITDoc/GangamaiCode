import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class AreaMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createAreaForm();
        this.myformSearch = this.createSearchForm();
    }

    createAreaForm(): FormGroup {
        return this._formBuilder.group({
            areaId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            areaName: ["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            cityId: [0,
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            cityName: [""],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            AreaNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createAreaForm();
    }

    public AreaMasterSave(Param: any) {
        if (Param.areaId) {
            return this._httpClient.PutData("AreaMaster/" + Param.areaId, Param);
        } else return this._httpClient.PostData("AreaMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("AreaMaster?Id=" + m_data.toString());
    }
}
