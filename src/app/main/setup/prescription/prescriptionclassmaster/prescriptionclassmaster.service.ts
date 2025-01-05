
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class PrescriptionclassmasterService {
    prescriptionForm: FormGroup;
    myformSearch: FormGroup;
    constructor( private _httpClient: ApiCaller, 
        private _formBuilder: FormBuilder) 
    { this.myformSearch = this.createSearchForm();}

    createPrescriptionclassForm(): FormGroup {
        return this._formBuilder.group({
            ClassId: [0],
            ClassName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"]
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


    public prescriptionClassMasterSave(Param: any, showLoader = true) {
        if (Param.classId) {
            return this._httpClient.PutData("Priscriptionclass/" + Param.ClassId, Param, showLoader);
        } else return this._httpClient.PostData("Priscriptionclass", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Priscriptionclass?Id=" + m_data.toString());
    }

}
