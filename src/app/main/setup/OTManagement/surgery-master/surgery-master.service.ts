import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class SurgeryMasterService {

    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myForm = this.createSurgeryForm();
        this.myformSearch = this.createSearchForm();
    }

    createSurgeryForm(): FormGroup {
        return this._formBuilder.group({
            SurgeryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            SurgeryName: ["",
                [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            surgeryCategoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            departmentId: [0, [ Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryAmount: [0, [ Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
            ottemplateId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            siteDescId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: 0,
            isCancelled: false,
            isCancelledBy: 0,
            isCancelledDateTime: "1900-01-01"


        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            SurgeryNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createSurgeryForm();
    }

    public surgerySave(Param: any) {
        if (Param.SurgeryId) {
            return this._httpClient.PutData("SurgeryMaster/" + Param.SurgeryId, Param);
        } else return this._httpClient.PostData("SurgeryMaster", Param);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SurgeryMaster?Id=" + m_data.toString());
    }
}
