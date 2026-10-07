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

            surgeryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            shortName: ["",[Validators.required,]],
            surgeryName: ["", [Validators.required]],
            departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            subSpecialty: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeryCategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeryTypeId: [0],
            surgeryAmount: [0, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
            siteDescId: [0],
            ottemplateId: [0],
            serviceId: 0,

            expectedSurgeryTime: [0],
            preparationTime: [0],
            cleaningTurnaroundTime: [0],
            totalDuration: [0],

            preAnaesthesiaClearance: [false],
            surgicalConsentRequired: [false],
            bloodArrangementRequired: [false],

            gradeLevel:[0],
            preferredOtroom:[0]

            // isCancelled: false,
            // isCancelledBy: 0,
            // isCancelledDateTime: "1900-01-01"
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
        if (Param.surgeryId) {
            return this._httpClient.PutData("SurgeryMaster/" + Param.surgeryId, Param);
        } else return this._httpClient.PostData("SurgeryMaster", Param);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SurgeryMaster?Id=" + m_data.toString());
    }
}
