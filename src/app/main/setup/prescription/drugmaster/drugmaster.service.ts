import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class DrugmasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createDrugForm();
        this.myformSearch = this.createSearchForm();
    }

    createDrugForm(): FormGroup {
        return this._formBuilder.group({
            drugId: [0],
            drugName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                   Validators.pattern('^[a-zA-Z0-9 ]*$')
                ] 
            ],
            genericId: ["",
               // Validators.required,
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            classId: ["",
                //Validators.required,
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            isActive:[true,[Validators.required]]
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

    public drugMasterSave(Param: any) {
        if (Param.drugId) {
            return this._httpClient.PutData("DrugMaster/" + Param.drugId, Param);
        } else return this._httpClient.PostData("DrugMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DrugMaster?Id=" + m_data.toString());
    }

}
