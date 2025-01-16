import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DosemasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myForm = this.createDoseForm();
        this.myformSearch = this.createSearchForm();
    }

    createDoseForm(): FormGroup {
        return this._formBuilder.group({
            doseId: [0],
            doseName: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            doseNameInEnglish: ["", 
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            doseNameInMarathi :["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            doseQtyPerDay: ["",
                [
                    Validators.required,
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            isActive:[false,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoseNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDoseForm();
    }

    public doseMasterInsert(Param: any, showLoader = true) {
        if (Param.doseId) {
            return this._httpClient.PutData("DoseMaster/" + Param.doseId, Param, showLoader);
        } else return this._httpClient.PostData("DoseMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DoseMaster?Id=" + m_data.toString());
    }
  
}
