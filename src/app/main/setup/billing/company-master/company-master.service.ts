import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class CompanyMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        public _loaderService: LoaderService
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
            IsDeleted: [true],
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

    public getCompanyMasterList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_CompList_by_Name", param);
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
    public getServiceListDetails(Param, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathRadServiceList", Param);
    }
    public SaveCompanyService(Param, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.post("Administration/InsertCompanyServiceAssignMaster", Param);
    }
    public deactivateTheStatus(param, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + param, {});
    }
    public getclassNameCombo(Param, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_BillingClassName", Param)
    }
    public getRtrvCompanyServList(Param, loader = true) {
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CompanyServiceInfo", Param)
    }
}
