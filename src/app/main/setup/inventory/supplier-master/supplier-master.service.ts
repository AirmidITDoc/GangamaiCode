import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupplierMaster } from "./supplier-master.component";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class SupplierMasterService {
    supplierForm: FormGroup;
    myformSearch: FormGroup;
    // registerObj = new SupplierMaster({});
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.supplierForm = this.createSuppliermasterForm();
    }

    createSuppliermasterForm(): FormGroup {
        return this._formBuilder.group({
            supplierId: [0],
            supplierName:["", [
                // Validators.required,
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
              ]],
            ContactPerson:["Subhash Choughule", [ 
                // Validators.required,
                // Validators.pattern("^[a-zA-Z._ -]+$"),
                // Validators.maxLength(100),
              ]],

            address: ["", 
                // Validators.required
            ],
            cityId: ["", 
                // Validators.required
            ],
            // CityName: [""],
            stateId: ["", 
                // Validators.required
            ],
            // StateName: [""],
            countryId: [""],
            // CountryName: [""],
            CreditPeriod: ["",
                // [
                //     Validators.required
                // ]
            ],
            mobile: ["", 
                [
                    // Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]
            ],
            phone:["", 
                [
                    Validators.minLength(10),
                    Validators.maxLength(10),
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]
            ],
            fax: ['',
                [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]
            ],
            email: ["",
                [
                    // Validators.required,
                    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
                ]
            ],
            modeofPayment: ["", 
                // Validators.required
            ],
            termofPayment: ["", 
                // Validators.required
            ],
            // TaxNature: ["", Validators.required],
            CurrencyId: [1],// Validators.pattern("[0-9]+")
            Octroi: [0],//Validators.pattern("[0-9]+")
            Freight: [0, 
                [
                    // Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.maxLength(10),
                ]
            ],
            gstNo: ["", 
                [
                    // Validators.required,
                    Validators.maxLength(15)
                ]
            ], //Validators.pattern("/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/")],
            panNo: ["",
                [
                    // Validators.required,
                    Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")
                ]
            ],
            supplierTime:  [(new Date()).toISOString()],
            mAssignSupplierToStores: [
                {
                    assignId: 0,
                    storeId: 0,
                    supplierId: 0
                }
            ]
            // StoreId: [""],
            // StoreName: [""],
            // AddedBy: [""],
            // IsDeleted: ["true"],
            // UpdatedBy: [""],
            // SupplierType:[""],
            // LicNo: ["", Validators.required],
            // ExpDate:[{ value: this.registerObj.ExpDate}],
            // // DlNo:["",Validators.pattern("^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$")],
          
            // DlNo:['', Validators.required],
            // MsmNo:[0],
            // MSMNo:[0],
            // Apprval:[""],
            // Pincode:[""],
            // Taluka:['', [
            //     Validators.required,
            //     Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //   ]],
            // BankName:["", Validators.required],
            // BankNo:['', 
            //     [
            //         Validators.required,
            //         Validators.pattern("[0-9]{9,18}"),
            //         Validators.minLength(9),
            //         Validators.maxLength(18)
            //     ]
            // ],
            // BankBranch:['', [
            //     Validators.required,
            //     Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //   ]],
            // IFSCcode:["",
            //     [
            //         Validators.required,
            //         Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")
            //     ]
            // ],
            // VenderTypeId:[""],
            // OpeningBal:['', 
            //     [
            //         Validators.required
            //         // Validators.pattern("^[0-9]*$"),
            //         // Validators.minLength(1),
            //         // Validators.maxLength(10)
            //     ]
            // ],
            // CreateApproval:[true],
            // MAssignSupplierToStores: ["", Validators.required],
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

    
    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
    }

   
    public SupplierSave(Param: any, showLoader = true) {
        debugger
        if (Param.supplierId) {
            return this._httpClient.PutData("Supplier/Edit/" + Param.supplierId,Param, showLoader);
        } else return this._httpClient.PostData("Supplier/InsertEDMX", Param, showLoader);
    }

    // public updateSupplierMaster(Param: any, showLoader = true) {
    //     if (Param.regId) {
    //         return this._httpClient.PutData("OutPatient/RegistrationUpdate" + Param.regId, Param, showLoader);
    //     } else return this._httpClient.PostData("OutPatient/RegistrationUpdate", Param, showLoader);
    // }

   
    public deleteAssignSupplierToStore(param) {
        return this._httpClient.PostData("Inventory/SupplierUpdate", param);
    }

    public getsupplierId(Id, showLoader = true) {
        return this._httpClient.GetData("Supplier/" + Id,showLoader);
    }   

    populateForm(param) {
        this.supplierForm.patchValue(param);
    }
}

