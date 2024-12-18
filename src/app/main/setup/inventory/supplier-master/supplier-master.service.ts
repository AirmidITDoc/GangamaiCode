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

   
    public deleteAssignSupplierToStore(param) {
        return this._httpClient.PostData("Inventory/SupplierUpdate", param);
    }

   

    populateForm(param) {
        this.myform.patchValue(param);
    }
}

