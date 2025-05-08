import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CertificateserviceService {

    myform: FormGroup;
    myformSearch: FormGroup;
   
    constructor(  private _httpClient: ApiCaller,private _formBuilder: UntypedFormBuilder) {
        this.myform=this.createRadiologytemplateForm();
        this.myformSearch=this.createSearchForm();
    }
  
    createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
            certificateId:[0],
            certificateName:["",
               [ Validators.required,
                Validators.pattern('^[a-zA-Z0-9 ]*$')],
                    [
                    //  Validators.required, Validators.maxLength(50),
                    //  Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    ]
                ],
            certificateDesc:["", 
            // Validators.required
            ],
            isActive:[true,
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