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
            SubCompanyId: [""],
            CompTypeId: [""],
            TypeName: [""],
            CompanyName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
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
                    Validators.minLength(6), 
                    Validators.maxLength(6),
                    Validators.pattern("^[0-9]*$")
                ]
            ],
            Phone: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            Mobile: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            FaxNo: [
                "",
                [
                    Validators.required,
                    // Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.pattern("^[+]?[0-9]*[- ()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            IsDeleted: ["true"],
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

    public getSubtpacompanyMasterList(param) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Rtrv_M_SubTPACompanyMasterList_by_Name",
            param
        );
    }
    public getCompanytypeCombobox() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=RetrieveCompanyTypeMasterForCombo ",
            {}
        );
    }

    public subTpaCompanyMasterInsert(Param: any, showLoader = true) {
        // return this._httpClient.PostData("Billing/SubTpaCompanySave", param);
        if (Param.SubCompanyId) {
            return this._httpClient.PutData("SubTpaCompany/" + Param.SubCompanyId, Param, showLoader);
        } else return this._httpClient.PostData("SubTpaCompany", Param, showLoader);
    }

    public subTpaCompanyMasterUpdate(param) {
        return this._httpClient.PostData("Billing/SubTpaCompanyUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubTpaCompany?Id=" + m_data.toString());
    }
}
