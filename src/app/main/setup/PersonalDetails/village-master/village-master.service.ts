import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class VillageMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myForm = this.createVillageForm();
        this.myformSearch = this.createSearchForm();
        
    }

    createVillageForm(): FormGroup {
        return this._formBuilder.group({
            villageId: [0],
            villageName: ["",
                [ Validators.required,
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                   ]
            ],
            talukaName: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isActive:[true,[Validators.required]]
        });
    }
  
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            VillageNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createVillageForm();
    }

    public stateMasterSave(Param: any) {
        if (Param.villageId) {
            return this._httpClient.PutData("VillageMaster/" + Param.villageId, Param);
        } else return this._httpClient.PostData("VillageMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("VillageMaster?Id=" + m_data.toString());
    }
}
