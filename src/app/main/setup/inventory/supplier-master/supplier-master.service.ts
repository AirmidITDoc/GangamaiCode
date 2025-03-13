import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class SupplierMasterService {
    supplierForm: FormGroup;
    myformSearch: FormGroup;

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
            supplierName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            ContactPerson: ["Hospital-Admin", [
                // Validators.required,
                // Validators.pattern("^[a-zA-Z._ -]+$"),
                // Validators.maxLength(100),
            ]],
            address: ["",
                Validators.required,
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            ],
            cityId: [0,
                Validators.required
            ],
            stateId: [0,
                Validators.required
            ],
            countryId: [0,
                Validators.required
            ],
            CreditPeriod: ["",
                [
                    Validators.required
                ]
            ],
            mobile: ["",
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]
            ],
            phone: ["",
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]
            ],
            fax: ["0",
                [
                    // Validators.required,
                    // Validators.maxLength(10),
                    // Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]
            ],
            email: ["",
                [
                    Validators.required,
                    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
                ]
            ],
            modeofPayment: ["",
                Validators.required
            ],
            termofPayment: ["",
                Validators.required
            ],
            CurrencyId: [1],
            Octroi: [0],
            Freight: [0,
                [
                    // Validators.required,
                    // Validators.pattern("^[0-9]*$"),
                    // Validators.maxLength(10),
                ]
            ],
            gstNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(15)
                ]
            ], 
            panNo: ["",
                [
                    Validators.required,
                    Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")
                ]
            ],
            supplierTime: [(new Date()).toISOString()],
            isActive:[true,[Validators.required]],
            mAssignSupplierToStores: [
                {
                    assignId: 0,
                    storeId: 0,
                    supplierId: 0
                }
            ]
        });
    }

    initializeFormGroup() {
        this.createSuppliermasterForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreId: 0,
            SupplierNameSearch: [""],
            // IsDeletedSearch: ["2"],
        });
    }

    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.DeleteData("Supplier/Cancel?Id=" + m_data.toString());
    // }

    public SupplierSave(Param: any) {

        if (Param.supplierId) {
            return this._httpClient.PutData("Supplier/Edit/" + Param.supplierId, Param);
        } else return this._httpClient.PostData("Supplier/InsertEDMX", Param);
    }

    public deleteAssignSupplierToStore(param) {
        return this._httpClient.PostData("Inventory/SupplierUpdate", param);
    }

    public getsupplierId(Id) {
        return this._httpClient.GetData("Supplier/" + Id);
    }

    populateForm(param) {
        this.supplierForm.patchValue(param);
    }

    public SupplierMasterCancle(Id: any) {
        
      return this._httpClient.DeleteData(`Supplier/SupplierDelete?Id=${Id}`);
    }
}

