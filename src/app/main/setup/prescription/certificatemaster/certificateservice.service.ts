import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class CertificateserviceService {

    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService) {
        this.myform = this.createRadiologytemplateForm();
        this.myformSearch = this.createSearchForm();
    }

    createRadiologytemplateForm(): FormGroup {
        return this._formBuilder.group({
            certificateId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            certificateName: ["",
                [Validators.required,
                Validators.pattern('^[a-zA-Z0-9 ]*$')],
                this._FormvalidationserviceService.allowEmptyStringValidator()

            ],
            certificateDesc: ["",
                // Validators.required
            ],
            isActive: [true,
                // [Validators.required]
            ],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TemplateNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createRadiologytemplateForm();
        this.createSearchForm();
    }

    public templateMasterSave(Param: any) {
        if (Param.certificateId) {
            return this._httpClient.PutData("PrescriptionCertificateMaster/" + Param.certificateId, Param);
        } else return this._httpClient.PostData("PrescriptionCertificateMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("PrescriptionCertificateMaster?Id=" + m_data.toString());
    }

}