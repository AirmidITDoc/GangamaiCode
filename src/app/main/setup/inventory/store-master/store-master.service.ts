import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, MaxLengthValidator, Validators } from "@angular/forms";
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
                    // Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            storeName: ["",
                [
                    // Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            indentPrefix: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            indentNo: ["",
                [
                    // Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            purchasePrefix: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],  
            purchaseNo: ["",
                [
                    // Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            grnPrefix: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],  
            grnNo: ["",
                [
                    // Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            grnreturnNoPrefix: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            grnreturnNo: ["",
                [
                    // Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            issueToDeptPrefix: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            issueToDeptNo: ["",
                [
                    // Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            returnFromDeptNoPrefix: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            returnFromDeptNo: ["",
                [
                    // Validators.required,
                    Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            isDeleted: ["true"],
            UpdatedBy: ["0"],
            AddedByName: ["0"],
            Header:[""],
            pharSalCountId:["",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            pharSalRecCountId:["",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            pharSalReturnCountId:["",
                [
                    // Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],

            workOrderPrefix: "0",
            workOrderNo: "0",
            pharAdvId: 0,
            pharAdvReptId: 0,
            pharAdvRefId: 0,
            pharAdvRefReptId: 0,
            printStoreName: [""],
            dlNo: [""],
            gstin: [""],
            storeAddress:[""],
            hospitalMobileNo: "1111111110",
            hospitalEmailId: [""],
            printStoreUnitName: [""],
            isPharStore: true,
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

    public getStoreById(Id, showLoader = true) {
        
        return this._httpClient.GetData("StoreMaster/" + Id,showLoader);
    }

    public storeMasterSave(Param: any, showLoader = true) {
        if (Param.storeId) {
            return this._httpClient.PutData("StoreMaster/" + Param.storeId, Param, showLoader);
        } else return this._httpClient.PostData("StoreMaster",Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
}