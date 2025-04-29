import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class StoreMasterService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    Validators.pattern("^[A-Za-z ]*$")
                ]
            ],
            storeName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
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
            pharSalCountId: ["",
                [
                    Validators.required
                ]
            ],
            pharSalRecCountId: ["",
                [
                    Validators.required
                ]
            ],
            pharSalReturnCountId: ["",
                [
                    Validators.required
                ]
            ],
            isActive: [true, [Validators.required]],
            workOrderPrefix: "0",
            workOrderNo: "0",
            pharAdvId: ["",
                [
                    Validators.required
                ]
            ],
            pharAdvReptId: ["",
                [
                    Validators.required
                ]
            ],
            pharAdvRefId: ["",
                [
                    Validators.required
                ]
            ],
            pharAdvRefReptId: ["",
                [
                    Validators.required
                ]
            ],
            printStoreName: [""],
            dlNo: ["0"],
            gstin: ["0"],
            storeAddress: [""],
            hospitalMobileNo: ["",
                [
                    // Validators.required,
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            hospitalEmailId: ["try@gmail.com"],
            printStoreUnitName: ["trying"],
            isPharStore: true,
            isWhatsAppMsg: true,
            whatsAppTemplateId: ["try"],
            isSmsmsg: true,
            smstemplateId: ["try"],
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