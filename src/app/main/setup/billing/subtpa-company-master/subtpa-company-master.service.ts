import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class SubtpaCompanyMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
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
            CompanyName: [""],
            Address: ["", Validators.required],
            City: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            PinNo: ["", [Validators.minLength(6), Validators.maxLength(6)]],
            PhoneNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            MobileNo: [
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
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            IsCancelled: ["false"],
            IsCancelledBy: [""],
            IsCancelledDate: [""],
            AddedByName: [""],
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

    public getSubtpacompanyMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_SubTPACompanyMaster_by_Name",
            { CompanyName: "%" }
        );
    }
    public getCompanytypeCombobox() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Retrieve_CompanyTypeMasterForCombo ",
            {}
        );
    }

    public subTpaCompanyMasterInsert(param) {
        return this._httpClient.post("Billing/SubTpaCompanyUpdate", param);
    }

    public subTpaCompanyMasterUpdate(param) {
        return this._httpClient.post("Billing/SubTpaCompanyUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
