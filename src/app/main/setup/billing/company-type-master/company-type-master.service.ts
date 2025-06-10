import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class CompanyTypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createcompanytypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createcompanytypeForm(): FormGroup {
        return this._formBuilder.group({
            companyTypeId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            typeName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z0-9]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive:[true,[Validators.required]],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TypeNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createcompanytypeForm();
    }

    public companytypeMasterSave(Param: any) {
        if (Param.companyTypeId) {
            return this._httpClient.PutData("CompanyTypeMaster/" + Param.companyTypeId, Param);
        } else return this._httpClient.PostData("CompanyTypeMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CompanyTypeMaster?Id=" + m_data.toString());
    }
}
