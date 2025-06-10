import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class BillingClassMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createClassForm();
        this.myformSearch = this.createSearchForm();
    }

    createClassForm(): FormGroup {
        return this._formBuilder.group({
            classId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            className: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            classRate: [0],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ClassNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createClassForm();
    }

    public classMasterSave(Param: any) {
        if (Param.classId) {
            return this._httpClient.PutData("ClassMaster/" + Param.classId, Param);
        } else return this._httpClient.PostData("ClassMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ClassMaster?Id=" + m_data.toString());
    }
    
}
