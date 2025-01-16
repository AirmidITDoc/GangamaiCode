import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class SubtpaCompanyMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createsubtpacompanyForm();
        this.myformSearch = this.createSearchForm();
    }
    createsubtpacompanyForm(): FormGroup {
        return this._formBuilder.group({
           
            subCompanyId: [0],
            compTypeId: ["",
                Validators.required
            ],
            companyName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            address: ["", 
                Validators.required,Validators.maxLength(100),
                Validators.pattern("^[a-zA-Z0-9\s,.'-]+$")
            ],
            city: [
                "",
                [
                    Validators.required
                ],
            ],
            pinNo: ["", 
                [
                    Validators.required,Validators.maxLength(10),
                    Validators.pattern("^[0-9\s\-]{3,10}$")
                ]
            ],
            phoneNo: [
                "",
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
            isActive:[false,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createsubtpacompanyForm();
    }

    public subTpaCompanyMasterInsert(Param: any, showLoader = true) {
        if (Param.subCompanyId) {
            return this._httpClient.PutData("SubTpaCompany/" + Param.subCompanyId, Param, showLoader);
        } else return this._httpClient.PostData("SubTpaCompany", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubTpaCompany?Id=" + m_data.toString());
    }
}
