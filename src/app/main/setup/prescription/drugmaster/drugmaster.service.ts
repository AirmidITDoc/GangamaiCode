import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DrugmasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDrugForm();
        this.myformSearch = this.createSearchForm();
    }

    createDrugForm(): FormGroup {
        return this._formBuilder.group({
            //as per payload :-
            //{
//   "drugId": 0,
//   "drugName": "string",
//   "genericId": 0,
//   "classId": 0
// }
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
            // GenericName: [""],
            classId: [0,
                // Validators.required
            ],
            // ClassName: [""],
            // isActive: true,
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
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
