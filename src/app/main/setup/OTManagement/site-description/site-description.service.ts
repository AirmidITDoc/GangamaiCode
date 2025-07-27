import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class SiteDescriptionService {

    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myForm = this.createSiteDescForm();
        this.myformSearch = this.createSearchForm();
    }

    createSiteDescForm(): FormGroup {
        return this._formBuilder.group({
            siteDescId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            siteDescriptionName: ["",
                [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            surgeryCategoryId: ["",
                [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            isCancelled: false,
            isCancelledBy: 0,
            isCancelledDateTime: "1900-01-01"


        });


    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            siteDescNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createSiteDescForm();
    }

    public siteDescriptionSave(Param: any) {
        if (Param.siteDescId) {
            return this._httpClient.PutData("SiteDescriptionMaster/" + Param.siteDescId, Param);
        } else return this._httpClient.PostData("SiteDescriptionMaster", Param);
    }
    public deactivateTheStatus(m_data) {
        debugger
        return this._httpClient.DeleteData("SiteDescriptionMaster?Id=" + m_data.toString());
    }
}
