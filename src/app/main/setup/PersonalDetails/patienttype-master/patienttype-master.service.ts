import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class PatienttypeMasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    )
    {
        this.myForm = this.createPatientTypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            PatientTypeSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    createPatientTypeForm(): FormGroup {
        return this._formBuilder.group({
            patientTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            patientType: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive:[true,[Validators.required]],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }

    initializeFormGroup() {
        this.createPatientTypeForm();
    }
    
    

    public patienttypeMasterSave(Param: any) {
        if (Param.patientTypeId) {
            return this._httpClient.PutData("PatientType/" + Param.patientTypeId, Param);
        } else return this._httpClient.PostData("PatientType", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PatientType?Id=" + m_data.toString());
    }
}
