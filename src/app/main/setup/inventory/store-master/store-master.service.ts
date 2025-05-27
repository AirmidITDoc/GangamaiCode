import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class StoreMasterService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createStoremasterForm();
    }

    createStoremasterForm(): FormGroup {
        return this._formBuilder.group({
            storeId: [0],
            storeShortName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z ]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            storeName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                  //  Validators.pattern("^[A-Za-z ]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            indentPrefix: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            indentNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            purchasePrefix: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            purchaseNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            grnPrefix: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            grnNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            grnreturnNoPrefix: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            grnreturnNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern("^[0-9 ]*$")
                ]
            ],
            issueToDeptPrefix: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            issueToDeptNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern("^[0-9 ]*$")
                ]
            ],
            returnFromDeptNoPrefix: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            returnFromDeptNo: ["",
                [
                    Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern("^[0-9 ]*$")
                ]
            ],
            // isDeleted: ["true"],
            // UpdatedBy: ["0"],
            // AddedByName: ["0"],
            header: [""],
            pharSalCountId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            pharSalRecCountId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            pharSalReturnCountId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            isActive: [true, [Validators.required]],
            workOrderPrefix: "0",
            workOrderNo: "0",
            pharAdvId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            pharAdvReptId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            pharAdvRefId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            pharAdvRefReptId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            printStoreName: [""],
            dlNo: ["0",
                [
                    Validators.required,
                    Validators.pattern("^[0-9 ]*$")
                ]
            ],
            gstin: ["0",
                [
                    Validators.required,
                    Validators.pattern("^[0-9 ]*$")
                ]
            ],
            storeAddress: [""],
            hospitalMobileNo: ["",
                [
                    // Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            hospitalEmailId: ["",[Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
            printStoreUnitName: [""],
            termsAndCondition:[''],
            addedBy:this._loggedService.currentUserValue.userId,
            updatedBy:this._loggedService.currentUserValue.userId,
            isPharStore: false,
            isWhatsAppMsg: true,
            whatsAppTemplateId: [""],
            isSmsmsg: true,
            smstemplateId: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createStoremasterForm();
    }

    public getStoreById(Id) {
        return this._httpClient.GetData("StoreMaster/" + Id);
    }

    public storeMasterSave(Param: any) {
    if (Param.storeId) {
            
            return this._httpClient.PutData("StoreMaster/"+ Param.storeId, Param);
        } else return this._httpClient.PostData("StoreMaster", Param);
    }


    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id="+ m_data.toString());
    }
}