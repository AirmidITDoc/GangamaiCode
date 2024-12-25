
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CompanyMasterService {
    companyForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.companyForm = this.createCompanymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCompanymasterForm(): FormGroup {
        return this._formBuilder.group({
            /* swagger :- JSON insert
            {
  "companyId": 0,
  "compTypeId": 0,
  "companyName": "string",
  "address": "string",
  "city": "string",
  "pinNo": "string",
  "phoneNo": "string",
  "mobileNo": "string",
  "faxNo": "string",
  "traiffId": 0
}
            */
            companyId: [0],
            companyName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            compTypeId: ["",
                Validators.required
            ],
            // TypeName: [""],
            address: ["",
                 Validators.required
            ],
            city: ["",
                [
                    Validators.required
                ],
            ],
            pinNo: ["", 
                [
                    Validators.required,
                    // Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    // Validators.maxLength(6)
                ]
            ],
            phoneNo: ["",
                [
                    Validators.required,
                    // Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    // Validators.maxLength(10),
                ],
            ],
            mobileNo: [
                "",
                [
                    Validators.required,
                    // Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    // Validators.maxLength(10),
                ],
            ],
            faxNo: ["0"],
            traiffId: [
                "",
                [
                    Validators.required
                ]
            ],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createCompanymasterForm();
    }
    
    public companyMasterSave(Param: any, showLoader = true) {
        if (Param.companyId) {
            return this._httpClient.PutData("CompanyMaster/" + Param.companyId, Param, showLoader);
        } else return this._httpClient.PostData("CompanyMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CompanyMaster?Id=" + m_data.toString());
    }
}
