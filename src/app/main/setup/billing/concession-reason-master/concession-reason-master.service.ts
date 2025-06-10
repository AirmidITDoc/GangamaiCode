import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class ConcessionReasonMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createConcessionreasonForm();
        this.myformSearch = this.createSearchForm();
    }
    
    createConcessionreasonForm(): FormGroup {
        return this._formBuilder.group({
            concessionId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            concessionReason: ["", 
                [
                    Validators.required,Validators.maxLength(50),
                  //  Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ConcessionReasonNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createConcessionreasonForm();
    }
    
    public concessionreasonMasterSave(Param: any) {
        if (Param.concessionId) {
            return this._httpClient.PutData("ConcessionReasonMaster/" + Param.concessionId, Param);
        } else return this._httpClient.PostData("ConcessionReasonMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ConcessionReasonMaster?Id=" + m_data.toString());
    }
}