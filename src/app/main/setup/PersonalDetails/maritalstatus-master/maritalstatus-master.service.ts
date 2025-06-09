import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class MaritalstatusMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createMaritalForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            MaritalStatusNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    createMaritalForm(): FormGroup {
        return this._formBuilder.group({
            maritalStatusId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            maritalStatusName: ["",
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
        this.createMaritalForm();
    }

  

    public MaritalStatusMasterSave(Param: any) {
        if (Param.maritalStatusId) {
            return this._httpClient.PutData("MaritalStatus/" + Param.maritalStatusId, Param);
        } else return this._httpClient.PostData("MaritalStatus", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("MaritalStatus?Id=" + m_data.toString());
    }
}
