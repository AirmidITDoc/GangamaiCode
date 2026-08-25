
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
@Injectable({
  providedIn: 'root'
})
export class ICDEMasterService {
   myForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myForm = this.createICDEForm();
        this.myformSearch = this.createSearchForm();
    }

    createICDEForm(): FormGroup {
        return this._formBuilder.group({
            icdid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            icdversion: ["",
                [
                    Validators.required, Validators.maxLength(200),
                    // Validators.pattern('^[a-zA-Z0-9 .&/-]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ]
            ,
            icdcode: ["",
                [
                    Validators.required,
                    // Validators.pattern('^[0-9]+(\\.[0-9]+)?$')
                   // Validators.pattern('^[0-9]*$')
                ]
            ],
            diagnosisName: ["",
                [
                    Validators.required, Validators.maxLength(500),
                    // Validators.pattern('^[a-zA-Z0-9 .&-]*$')
                ]
            ],
            shortName: ["",
                [
                    Validators.required, Validators.maxLength(100),
                   // Validators.pattern('^[a-zA-Z0-9 .&-]*$')
                ]
            ]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoseNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createICDEForm();
    }

    public IcdeMasterInsert(Param: any) {
        if (Param.icdid) {
            return this._httpClient.PutData("MIcdDiagnosisMaster/" + Param.icdid, Param);
        } else return this._httpClient.PostData("MIcdDiagnosisMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        debugger
        return this._httpClient.DeleteData("MIcdDiagnosisMaster?Id=" + m_data.toString());
    }

}

