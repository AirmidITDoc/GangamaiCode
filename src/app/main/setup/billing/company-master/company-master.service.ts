
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CompanyMasterService {
    companyForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.companyForm = this.createCompanymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCompanymasterForm(): FormGroup {
        return this._formBuilder.group({
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
            address: ["",
                 Validators.required,Validators.maxLength(100),
                 Validators.pattern("^[a-zA-Z0-9\s,.'-]+$")
            ],
            city: ["",
                [
                    Validators.required
                ],
            ],
            pinNo: ["", 
                [
                    Validators.required,
                    Validators.required,Validators.maxLength(10),
                    Validators.pattern("^[0-9\s\-]{3,10}$")
                ]
            ],
            phoneNo: ["",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.maxLength(10),
                ],
            ],
            mobileNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.maxLength(10),
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
