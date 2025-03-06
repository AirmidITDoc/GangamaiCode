import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTemplateMasterService {

    myform: FormGroup;
    myformSearch: FormGroup;
  
    constructor(  private _httpClient: ApiCaller,private _formBuilder: UntypedFormBuilder) {
        this.myform=this.createRadiologytemplateForm();
        this.myformSearch=this.createSearchForm();
    }
 
    createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
            templateId:[0],
            templateName:["",
                    [
                        Validators.required, Validators.maxLength(50),
                        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    ]
                ],
            templateDesc:["", 
                // Validators.required
            ],
            isActive:[true,[Validators.required]]
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
        if (Param.templateId) {
            return this._httpClient.PutData("RadiologyTemplate/" + Param.templateId, Param);
        } else return this._httpClient.PostData("RadiologyTemplate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("RadiologyTemplate?Id=" + m_data.toString());
    }
}