
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrescriptionclassmasterService {
    prescriptionForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
    }

    /** 
    {
        "classId": 0,
        "className": "ABC",
        "templateDescName": "XYZ"
    }
    */

    createPrescriptionclassForm(): FormGroup {
        return this._formBuilder.group({
            classId: [0],
            className: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            templateDescName: ["",Validators.required],
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
        this.createPrescriptionclassForm();
    }

    public prescriptionClassMasterSave(Param: any) {
        if (Param.classId) {
            
            return this._httpClient.PutData("Priscriptionclass/" + Param.classId, Param);
        } else return this._httpClient.PostData("Priscriptionclass", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Priscriptionclass?Id=" + m_data.toString());
    }

}
