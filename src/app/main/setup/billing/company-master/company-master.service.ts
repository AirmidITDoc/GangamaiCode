import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CompanyMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCompanymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCompanymasterForm(): FormGroup {
        return this._formBuilder.group({
            CompanyId: [""],
            CompanyName: [""],
            CompTypeId: [""],
            TypeName: [""],
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
            TariffId: [""],
            TariffName: [""],
            IsCancelled: [""],
            IsCancelledBy: ["", Validators.pattern("[0-9]+")],
            IsCancelledDate: [""],
            AddedByName: [""],
            IsDeleted: ["false"],
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

    public getCompanyMaster(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_CompList_by_Name",
            param
        );
    }

    public getCompanytypeMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveCompanyTypeMasterForCombo",
            {}
        );
    }

    public getTariffMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=RetrieveTariffMasterForCombo",
            {}
        );
    }

    public companyMasterInsert(param) {
        return this._httpClient.post("Billing/CompanySave", param);
    }

    public companyMasterUpdate(param) {
        return this._httpClient.post("Billing/CompanyUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
