import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class BedMasterService {
    
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createBedForm();
        this.myformSearch = this.createSearchForm();
    }

    createBedForm(): FormGroup {
        return this._formBuilder.group({
            bedId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            bedName: ["",
                [
                    Validators.required,
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            roomId: [0,
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            isAvailible: true,
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BedNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createBedForm();
    }

    public bedMasterSave(Param: any) {
        if (Param.bedId) {
            return this._httpClient.PutData("BedMaster/" + Param.bedId, Param);
        } else return this._httpClient.PostData("BedMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("BedMaster?Id=" + m_data.toString());
    }
}
