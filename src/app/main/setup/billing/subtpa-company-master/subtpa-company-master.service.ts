import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class SubtpaCompanyMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createsubtpacompanyForm();
        this.myformSearch = this.createSearchForm();
    }
    createsubtpacompanyForm(): FormGroup {
        return this._formBuilder.group({
            /**
             * { swagger JSON insert :-
            "subCompanyId": 0,
            "compTypeId": 0,
            "companyName": "string",
            "address": "string",
            "city": "string",
            "pinNo": "string",
            "phoneNo": "string",
            "mobileNo": "string",
            "faxNo": "string"
            }
             */
            subCompanyId: [0],
            compTypeId: [""],
            // TypeName: [""],
            companyName: ["",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            address: ["", 
                // Validators.required
            ],
            city: [
                "",
                [
                    // Validators.required
                ],
            ],
            pinNo: ["", 
                [
                    // Validators.required,
                    // Validators.minLength(6), 
                    // Validators.maxLength(6),
                    // Validators.pattern("^[0-9]*$")
                ]
            ],
            phoneNo: [
                "",
                [
                    // Validators.required,
                    // Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    // Validators.minLength(10),
                    // Validators.maxLength(15),
                ],
            ],
            mobileNo: [
                "",
                [
                    // Validators.required,
                    // Validators.pattern("^[0-9]*$"),
                    // Validators.minLength(10),
                    // Validators.maxLength(10),
                ],
            ],
            faxNo: [
                "0",
                // [
                //     Validators.required,
                //     // Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                //     Validators.pattern("^[+]?[0-9]*[- ()0-9]*$"),
                //     Validators.minLength(10),
                //     Validators.maxLength(15),
                // ],
            ],
            // IsDeleted: ["true"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // IsCancelled: ["false"],
            // IsCancelledBy: [""],
            // IsCancelledDate: [""],
            // AddedByName: [""],
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
