import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class RadiologyTemplateMasterService {

    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService) {
        // this.myform = this.createRadiologytemplateForm();
        this.myformSearch = this.createSearchForm();
    }



    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TemplateNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        // this.createRadiologytemplateForm();
        // this.createSearchForm();
    }

    public templateMasterSave(Param: any) {
        if (Param.templateId) {
            return this._httpClient.PutData("RadiologyTemplate/" + Param.templateId, Param);
        } else return this._httpClient.PostData("RadiologyTemplate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("RadiologyTemplate?Id=" + m_data.toString());
    }
}