import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DrugmasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createDrugForm();
        this.myformSearch = this.createSearchForm();
    }

    createDrugForm(): UntypedFormGroup {
        return this._formBuilder.group({
            drugId: [0],
            drugName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            genericId: ["",
                Validators.required
            ],
            classId: [0,
                // Validators.required
            ],
        });
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            DrugNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDrugForm();
    } 

    public drugMasterSave(Param: any, showLoader = true) {
        if (Param.drugId) {
            return this._httpClient.PutData("DrugMaster/" + Param.drugId, Param, showLoader);
        } else return this._httpClient.PostData("DrugMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Drug?Id=" + m_data.toString());
    }

}
