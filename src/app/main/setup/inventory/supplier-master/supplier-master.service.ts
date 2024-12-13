import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupplierMaster } from "./supplier-master.component";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class SupplierMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    registerObj = new SupplierMaster({});
    constructor(
        private _httpClient: ApiCaller,
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
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
              ]],
            ContactPerson:['', [ 
                // Validators.required,
                // Validators.pattern("^[a-zA-Z._ -]+$"),
                // Validators.maxLength(100),
              ]],

            Address: ["", Validators.required],
            CityId: ["", Validators.required],
            CityName: [""],
            StateId: ["", Validators.required],
            StateName: [""],
            CountryId: [""],
            CountryName: [""],
            CreditPeriod: ["",
                [
                    Validators.required
                ]
            ],
            Mobile:['', 
                [
                    Validators.required
                ]
            ],
            Phone:['', 
                [
                    Validators.required
                ]
            ],
            Fax: ["",
                [
                    Validators.required,
                    Validators.maxLength(10)
                ]
            ],
            Email: ["",
                [
                    Validators.required,
                    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
                ]
            ],
            ModeOfPayment: ["", Validators.required],
            TermOfPayment: ["", Validators.required],
            TaxNature: ["", Validators.required],
            CurrencyId: [""],// Validators.pattern("[0-9]+")
            Octroi: [""],//Validators.pattern("[0-9]+")
            Freight: ['', 
                    [
                        Validators.required,
                        Validators.pattern("^[0-9]*$"),
                        Validators.maxLength(10),
                    ]
                ],
            GSTNo: ["", 
                [
                    Validators.required,
                    Validators.maxLength(15)
                ]
            ], //Validators.pattern("/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/")],
            PanNo: ["",
                [
                    Validators.required,
                    Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")
                ]
            ],
            StoreId: [""],
            StoreName: [""],
            AddedBy: [""],
            IsDeleted: ["true"],
            UpdatedBy: [""],
            SupplierType:[""],
            LicNo: ["", Validators.required],
            ExpDate:[{ value: this.registerObj.ExpDate}],
            // DlNo:["",Validators.pattern("^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$")],
          
            DlNo:['', Validators.required],
            MsmNo:[0],
            MSMNo:[0],
            Apprval:[""],
            Pincode:[""],
            Taluka:['', [
                Validators.required,
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
              ]],
            BankName:["", Validators.required],
            BankNo:['', 
                [
                    Validators.required,
                    Validators.pattern("[0-9]{9,18}"),
                    Validators.minLength(9),
                    Validators.maxLength(18)
                ]
            ],
            BankBranch:['', [
                Validators.required,
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
              ]],
            IFSCcode:["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")
                ]
            ],
            VenderTypeId:[""],
            OpeningBal:['', 
                [
                    Validators.required
                    // Validators.pattern("^[0-9]*$"),
                    // Validators.minLength(1),
                    // Validators.maxLength(10)
                ]
            ],
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

    public getSupplierMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("Supplier/SupplierList", param, showLoader);
    }

    public getStoreMasterserviceCombo(m_data) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=m_Rtrv_StoreSupplierwise",
            m_data
        );
    }

    
    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
    }

    public getCountryMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_CountryMasterForCombo",
            {}
        );
    }

    public getStateMasterCombo(data) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",data
        );
    }

    public getCityMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_CityMasterForCombo",
            {}
        );
    }

    public getStoreMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_StoreNameForCombo",
            {}
        );
    }


    public getVenderMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=M_Rtrv_M_VenderTypeMaster",
            {}
        );
    }

    


    public SupplierSave(Param: any, showLoader = true) {
        if (Param.supplierId) {
            return this._httpClient.PutData("Supplier/InsertSP" + Param.supplierId, Param, showLoader);
        } else return this._httpClient.PostData("Supplier/InsertSP", Param, showLoader);
    }

    public updateSupplierMaster(Param: any, showLoader = true) {
        if (Param.regId) {
            return this._httpClient.PutData("OutPatient/RegistrationUpdate" + Param.regId, Param, showLoader);
        } else return this._httpClient.PostData("OutPatient/RegistrationUpdate", Param, showLoader);
    }

    public getStateList(CityId) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",
            { Id: CityId }
        );
    }

    public getCountryList(StateId) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional",
            { Id: StateId }
        );
    }

    public getModeofpaymentMasterCombo(){
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_modeofpaymentForcombo",
            { }
        );
    }

    public getBankMasterCombo() {
        return this._httpClient.PostData("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
      }
    public getTermofpaymentMasterCombo(){
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_termsofpaymentMaster",
            { }
        );
    }

    public deleteAssignSupplierToStore(param) {
        return this._httpClient.PostData("Inventory/SupplierUpdate", param);
    }

    public getSuppliertypeList(m) {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Rtrv_Constants ",m
        );
    }


    populateForm(param) {
        this.myform.patchValue(param);
    }
}

// old code
// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { SupplierMaster } from "./supplier-master.component";
// import { gridRequest } from "app/core/models/gridRequest";
// import { ApiCaller } from "app/core/services/apiCaller";

// @Injectable({
//     providedIn: "root",
// })
// export class SupplierMasterService {
//     myform: FormGroup;
//     myformSearch: FormGroup;
//     registerObj = new SupplierMaster({});
//     constructor(
//         private _httpClient: HttpClient,
//         private _formBuilder: FormBuilder
//     ) {
//         this.myformSearch = this.createSearchForm();
//         this.myform = this.createSuppliermasterForm();
//     }

//     createSuppliermasterForm(): FormGroup {
//         return this._formBuilder.group({
//             SupplierId: [""],
//             SupplierName:['', [
//                 Validators.required,
//                 Validators.pattern("^[a-zA-Z ]*$"),
//                 Validators.maxLength(200),
//               ]],
//             ContactPerson:['', [ 
//                 Validators.pattern("^[a-zA-Z._ -]+$"),
//                 Validators.maxLength(100),
//               ]],

//             Address: [""],
//             CityId: ["", Validators.required],
//             CityName: [""],
//             StateId: ["", Validators.required],
//             StateName: [""],
//             CountryId: ["", Validators.required],
//             CountryName: [""],
//             CreditPeriod: [""],
//             Mobile:['', [Validators.required, Validators.pattern("^[0-9]*$"),
//             Validators.minLength(10),
//             Validators.maxLength(10),]],
//             Phone:['', [Validators.pattern("^[0-9]*$"),
//             Validators.minLength(10),
//             Validators.maxLength(10),]],
//             Fax: ["", Validators.maxLength(10)],
//             Email: [
//                 "",
//                 Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
//             ],
//             ModeOfPayment: [""],// Validators.pattern("[0-9]+")],
//             TermOfPayment: [""],// Validators.pattern("[0-9]+")],
//             TaxNature: ["", Validators.pattern("[0-9]+")],
//             CurrencyId: ["", Validators.pattern("[0-9]+")],
//             Octroi: ["", Validators.pattern("[0-9]+")],
//             Freight: ['', [Validators.pattern("^[0-9]*$"),
//                 Validators.minLength(1),
//                 Validators.maxLength(10),]],
//             GSTNo: ["", [Validators.minLength(15),
//             Validators.maxLength(15)],], //Validators.pattern("/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/")],
//             PanNo: ["",Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")],
//             StoreId: ["", Validators.required],
//             StoreName: [""],
//             AddedBy: [""],
//             IsDeleted: ["true"],
//             UpdatedBy: [""],
//             SupplierType:[""],
//             LicNo: [""],
//             ExpDate:[{ value: this.registerObj.ExpDate}],
//             // DlNo:["",Validators.pattern("^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$")],
          
//             DlNo:[''],
//             MsmNo:[0],
//             MSMNo:[0],
//             Apprval:[""],
//             Pincode:[""],
//             Taluka:[""],
//             BankName:[""],
//             BankNo:['', [Validators.pattern("[0-9]{9,18}")]],
//             BankBranch:[""],
//             IFSCcode:["",[Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
//             VenderTypeId:[""],
//             OpeningBal:['', [Validators.pattern("^[0-9]*$"),
//                 Validators.minLength(1),
//                 Validators.maxLength(10),]],
//             CreateApproval:[true],
//         });
//     }

//     initializeFormGroup() {
//         this.createSuppliermasterForm();
//     }

//     createSearchForm(): FormGroup {
//         return this._formBuilder.group({
//             SupplierNameSearch: [""],
//             IsDeletedSearch: ["2"],
//         });
//     }

//     public getSupplierMasterList(m_data) {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=m_Rtrv_SupplierMasterList_by_Name",
//             m_data
//         );
//     }

//     public getStoreMasterserviceCombo(m_data) {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=m_Rtrv_StoreSupplierwise",
//             m_data
//         );
//     }

    
//     public deactivateTheStatus(m_data) {
//         return this._httpClient.post(
//             "Generic/ExecByQueryStatement?query=" + m_data,
//             {}
//         );
//     }

//     public getCountryMasterCombo() {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_CountryMasterForCombo",
//             {}
//         );
//     }

//     public getStateMasterCombo(data) {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",data
//         );
//     }

//     public getCityMasterCombo() {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_CityMasterForCombo",
//             {}
//         );
//     }

//     public getStoreMasterCombo() {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_StoreNameForCombo",
//             {}
//         );
//     }


//     public getVenderMasterCombo() {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=M_Rtrv_M_VenderTypeMaster",
//             {}
//         );
//     }

//     public insertSupplierMaster(param) {
//         return this._httpClient.post("Inventory/SupplierSave", param);
//     }

//     public updateSupplierMaster(param) {
//         return this._httpClient.post("Inventory/SupplierUpdate", param);
//     }

//     public insertAssignSupplierToStore(param) {
//         return this._httpClient.post("Inventory/SupplierSave", param);
//     }

//     public getStateList(CityId) {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",
//             { Id: CityId }
//         );
//     }

//     public getCountryList(StateId) {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_CountryMasterForCombo_Conditional",
//             { Id: StateId }
//         );
//     }

//     public getModeofpaymentMasterCombo(){
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_modeofpaymentForcombo",
//             { }
//         );
//     }

//     public getBankMasterCombo() {
//         return this._httpClient.post("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
//       }
//     public getTermofpaymentMasterCombo(){
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Retrieve_termsofpaymentMaster",
//             { }
//         );
//     }

//     public deleteAssignSupplierToStore(param) {
//         return this._httpClient.post("Inventory/SupplierUpdate", param);
//     }

//     public getSuppliertypeList(m) {
//         return this._httpClient.post(
//             "Generic/GetByProc?procName=Rtrv_Constants ",m
//         );
//     }


//     populateForm(param) {
//         this.myform.patchValue(param);
//     }
// }
