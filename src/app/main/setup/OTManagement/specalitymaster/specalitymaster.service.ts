import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class SpecalitymasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myForm = this.createSpecalityForm();
        this.myformSearch = this.createSearchForm();
    }

    createSpecalityForm(): FormGroup {
        return this._formBuilder.group({
            specialtyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            specialtyName: ["",
                [
                    Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive: [true, [Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            SurgeryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createSpecalityForm();
    }

    public specalitySave(Param: any) {
        if (Param.specialtyId) {
            return this._httpClient.PutData("SpecialtyMaster/" + Param.specialtyId, Param);
        } else return this._httpClient.PostData("SpecialtyMaster", Param);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SpecialtyMaster?Id=" + m_data.toString());
    }
}
