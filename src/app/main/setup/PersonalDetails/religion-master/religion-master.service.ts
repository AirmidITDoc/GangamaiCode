import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class ReligionMasterService {
     myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
              this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ReligionNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }
    CreateReligionForm(): FormGroup {
        return this._formBuilder.group({
            religionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            religionName: ["",
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
    initializeFormGroup() {
        this.CreateReligionForm();
    }

    public getreligionMasterList(param: gridRequest) {
        return this._httpClient.PostData("ReligionMaster/List", param);
    }

    public religionMasterSave(Param: any) {
        if (Param.religionId) {
            return this._httpClient.PutData("ReligionMaster/" + Param.religionId, Param);
        } else return this._httpClient.PostData("ReligionMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ReligionMaster?Id=" + m_data.toString());
    }

}
