import { HttpClient } from "@angular/common/http";
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
        // this.companyForm = this.createCompanymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCompanymasterForm(): FormGroup {
        return this._formBuilder.group({
            CompanyId: [""],
            CompanyName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            CompTypeId: [""],
            TypeName: [""],
            Address: ["", Validators.required],
            City: [
                "",
                [
                    Validators.required
                ],
            ],
            PinNo: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(6),
                     Validators.maxLength(6)
                    ]
                ],
            PhoneNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            MobileNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            FaxNo: [
                "",
                [
                    // Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            TariffId: [
                "",
                [
                    Validators.required
                ]
            ],
            TariffName: [""],
            IsCancelled: [""],
            IsCancelledBy: ["", Validators.pattern("[0-9]+")],
            IsCancelledDate: [""],
            AddedByName: [""],
            IsDeleted: ["true"],
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
    getValidationMessages() {
        return {
            companyName: [
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
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
