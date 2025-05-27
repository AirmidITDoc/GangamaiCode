import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ReligionMasterService {
     myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
            religionId: [0],
            religionName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
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
