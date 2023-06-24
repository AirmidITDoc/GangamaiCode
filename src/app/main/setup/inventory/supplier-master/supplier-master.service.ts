import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class SupplierMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createSuppliermasterForm();
    }

    createSuppliermasterForm(): FormGroup {
        return this._formBuilder.group({
            SupplierId: [""],
            SupplierName: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                ],
            ],
            ContactPerson: ["", [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")]],
            Address: [""],
            CityId: ["", Validators.required],
            CityName: [""],
            StateId: ["", Validators.required],
            StateName: [""],
            CountryId: ["", Validators.required],
            CountryName: [""],
            CreditPeriod: [""],
            Mobile: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            Phone: [
                "",
                [
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(15),
                ],
            ],
            Fax: ["", Validators.maxLength(10)],
            Email: [
                "",
                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
            ],
            ModeOfPayment: ["", Validators.pattern("[0-9]+")],
            TermOfPayment: ["", Validators.pattern("[0-9]+")],
            TaxNature: ["", Validators.pattern("[0-9]+")],
            CurrencyId: ["", Validators.pattern("[0-9]+")],
            Octroi: ["", Validators.pattern("[0-9]+")],
            Freight: ["", Validators.pattern("[0-9]+")],
            GSTNo: [""], //Validators.pattern("[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")],
            PanNo: [""], //Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")],
            StoreId: ["", Validators.required],
            StoreName: [""],
            AddedBy: [""],
            IsDeleted: ["false"],
            UpdatedBy: [""],
        });
    }

    initializeFormGroup() {
        this.createSuppliermasterForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            SupplierNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    public getSupplierMasterList(m_data) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_SupplierMasterList_by_Name",
            m_data
        );
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
    }

    public getCountryMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_CountryMasterForCombo",
            {}
        );
    }

    public getStateMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_StateMasterForCombo",
            {}
        );
    }

    public getCityMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_CityMasterForCombo",
            {}
        );
    }

    public getStoreMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_StoreNameForCombo",
            {}
        );
    }

    public insertSupplierMaster(param) {
        return this._httpClient.post("Inventory/SupplierSave", param);
    }

    public updateSupplierMaster(param) {
        return this._httpClient.post("Inventory/SupplierUpdate", param);
    }

    public insertAssignSupplierToStore(param) {
        return this._httpClient.post("Inventory/SupplierSave", param);
    }

    public getStateList(CityId) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",
            { Id: CityId }
        );
    }

    public getCountryList(StateId) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional",
            { Id: StateId }
        );
    }

    public deleteAssignSupplierToStore(param) {
        return this._httpClient.post("Inventory/SupplierUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
