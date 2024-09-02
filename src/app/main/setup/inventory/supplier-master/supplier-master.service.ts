import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupplierMaster } from "./supplier-master.component";

@Injectable({
    providedIn: "root",
})
export class SupplierMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    registerObj = new SupplierMaster({});
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
            SupplierName:['', [
                Validators.required,
                Validators.pattern("^[a-zA-Z ]*$"),
                Validators.maxLength(200),
              ]],
            ContactPerson:['', [ 
                Validators.pattern("^[a-zA-Z._ -]+$"),
                Validators.maxLength(100),
              ]],

            Address: [""],
            CityId: ["", Validators.required],
            CityName: [""],
            StateId: ["", Validators.required],
            StateName: [""],
            CountryId: ["", Validators.required],
            CountryName: [""],
            CreditPeriod: [""],
            Mobile:['', [Validators.required, Validators.pattern("^[0-9]*$"),
            Validators.minLength(10),
            Validators.maxLength(10),]],
            Phone:['', [Validators.pattern("^[0-9]*$"),
            Validators.minLength(10),
            Validators.maxLength(10),]],
            Fax: ["", Validators.maxLength(10)],
            Email: [
                "",
                Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
            ],
            ModeOfPayment: [""],// Validators.pattern("[0-9]+")],
            TermOfPayment: [""],// Validators.pattern("[0-9]+")],
            TaxNature: ["", Validators.pattern("[0-9]+")],
            CurrencyId: ["", Validators.pattern("[0-9]+")],
            Octroi: ["", Validators.pattern("[0-9]+")],
            Freight: ['', [Validators.pattern("^[0-9]*$"),
                Validators.minLength(1),
                Validators.maxLength(10),]],
            GSTNo: ["", [Validators.minLength(15),
            Validators.maxLength(15)],], //Validators.pattern("/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/")],
            PanNo: ["",Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")],
            StoreId: ["", Validators.required],
            StoreName: [""],
            AddedBy: [""],
            IsDeleted: ["false"],
            UpdatedBy: [""],
            SupplierType:[""],
            LicNo: [""],
            ExpDate:[{ value: this.registerObj.ExpDate}],
            // DlNo:["",Validators.pattern("^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$")],
          
            DlNo:[''],
            MsmNo:[0],
            MSMNo:[0],
            Apprval:[""],
            Pincode:[""],
            Taluka:[""],
            BankName:[""],
            BankNo:['', [Validators.pattern("[0-9]{9,18}")]],
            BankBranch:[""],
            IFSCcode:["",[Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
            VenderTypeId:[""],
            OpeningBal:['', [Validators.pattern("^[0-9]*$"),
                Validators.minLength(1),
                Validators.maxLength(10),]],
            CreateApproval:[true],
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
            "Generic/GetByProc?procName=m_Rtrv_SupplierMasterList_by_Name",
            m_data
        );
    }

    public getStoreMasterserviceCombo(m_data) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_StoreSupplierwise",
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

    public getStateMasterCombo(data) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",data
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


    public getVenderMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=M_Rtrv_M_VenderTypeMaster",
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

    public getModeofpaymentMasterCombo(){
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_modeofpaymentForcombo",
            { }
        );
    }

    public getBankMasterCombo() {
        return this._httpClient.post("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
      }
    public getTermofpaymentMasterCombo(){
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_termsofpaymentMaster",
            { }
        );
    }

    public deleteAssignSupplierToStore(param) {
        return this._httpClient.post("Inventory/SupplierUpdate", param);
    }

    public getSuppliertypeList(m) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_Constants ",m
        );
    }


    populateForm(param) {
        this.myform.patchValue(param);
    }
}
