import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";

@Injectable()
export class SupplierMasterService {
    supplierForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
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
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            ContactPerson: ["Hospital-Admin", [
                // Validators.required,
                // Validators.pattern("^[a-zA-Z._ -]+$"),
                // Validators.maxLength(100),
            ]],
            address: ["",
                [Validators.required,
                    // Validators.pattern("^[A-Za-z0-9.,\\s]*$") 
                ]
            ],
            cityId: ['',
                [Validators.required]
            ],
            stateId: ['',
                [Validators.required]
            ],
            countryId: ['',
                [Validators.required]
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
                    // Validators.pattern("^[0-9 ]*$")
                ]
            ],
            phone: ["",
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                    // Validators.pattern("^[0-9 ]*$")
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
                    // Validators.pattern("^\\s*[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}\\s*$")
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
            Freight: ['0',
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
                    // Validators.pattern("^\\s*[A-Z]{5}[0-9]{4}[A-Z]{1}\\s*$")
                ]
            ],
            supplierTime: [(new Date()).toISOString()],
            // 
            taxNature: [''],
            licNo: [''],
            dlno: [''],
            taluka: [''],
            bankName: [],
            bankId: [''],
            BankBranch: [''],
            bankNo: ['', [Validators.pattern("[0-9]{9,18}")]],
            IFSCcode: ["", [Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
            expDate: [new Date()],
            OpeningBal: ['', [Validators.pattern("^[0-9]*$"),
            Validators.minLength(1),
            Validators.maxLength(10),]],
            MsmNo: [0],
            MSMNo: ['', Validators.required],
            CreateApproval: [true],
            pinCode: ['', [Validators.pattern("^[0-9]*$"),
                Validators.minLength(6),
                Validators.maxLength(6),]],
            isActive: [true, [Validators.required]],
            addedby: this._loggedService.currentUserValue.userId,
            // 
            mAssignSupplierToStores: [
                {
                    assignId: 0,
                    storeId: 0,
                    supplierId: 0
                }, [Validators.required]
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

    public getstateId(Id) {
        return this._httpClient.GetData("StateMaster/" + Id);
    }
}

