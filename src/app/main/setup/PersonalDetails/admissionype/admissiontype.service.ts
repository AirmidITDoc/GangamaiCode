import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class AdmissiontypeService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createadmissiontypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createadmissiontypeForm(): FormGroup {
        return this._formBuilder.group({
            admissiontypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            admissiontypeName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    // Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],

            isActive: [true, [Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            NameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createadmissiontypeForm();
    }

    public AdmissiontypeMasterSave(Param: any) {
        if (Param.admissiontypeId) {
            return this._httpClient.PutData("AdmissionType/" + Param.admissiontypeId, Param);
        } else return this._httpClient.PostData("AdmissionType", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("AdmissionType?Id=" + m_data.toString());
    }
}