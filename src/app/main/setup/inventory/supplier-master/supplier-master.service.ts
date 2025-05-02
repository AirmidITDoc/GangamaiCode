import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()
export class SupplierMasterService {
    supplierForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
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
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            ContactPerson: ["Hospital-Admin", [
                // Validators.required,
                // Validators.pattern("^[a-zA-Z._ -]+$"),
                // Validators.maxLength(100),
            ]],
            address: ["", [Validators.required]
            ],
            cityId: [0,
                [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            stateId: [0,
                [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            countryId: [0,
                [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
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
            isActive: [true, [Validators.required]],
            email: ["",
                [
                    Validators.required,
                    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$")
                ]
            ],
            modeofPayment: [0,
               [ Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
            ],
            termofPayment: [0,
               [ Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
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
            taluka: [''],
            licNo: [''],
            pinCode: ['', [Validators.pattern("^[0-9]*$"),
                Validators.minLength(6),
                Validators.maxLength(6),]],
            taxNature: ['', Validators.pattern("^[0-9]*$")],
            expDate: [new Date()],
            dlno: [''],
            bankId: [''],
            bankName: [],
            branch: [''],
            bankNo: ['', [Validators.pattern("[0-9]{9,18}")]],
            ifsccode: ["", [Validators.pattern("^[A-Z]{4}0[A-Z0-9]{6}$")]],
            venderTypeId:[0],
            openingBalance: ['', [Validators.pattern("^[0-9]*$"),
                Validators.minLength(1),
                Validators.maxLength(10),]],
            supplierTime: [(new Date()).toISOString()],
            mAssignSupplierToStores: [
                {
                    assignId: 0,
                    storeId: 0,
                    supplierId: 0
                }, [Validators.required]
            ],

            // 
            
           
            MsmNo: [0],
            MSMNo: ['', Validators.required],
            CreateApproval: [true],
            
            addedby: this._loggedService.currentUserValue.userId,
            // 
           
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

