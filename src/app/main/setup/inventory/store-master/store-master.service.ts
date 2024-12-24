import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class StoreMasterService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createStoremasterForm();
    }

    createStoremasterForm(): FormGroup {
        return this._formBuilder.group({
            storeId: [0],
            storeShortName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            storeName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            indentPrefix: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            indentNo: ["",
                [
                    Validators.required,Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            purchasePrefix: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],  
            purchaseNo: ["",
                [
                    Validators.required,Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            grnPrefix: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],  
            grnNo: ["",
                [
                    Validators.required,Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            grnreturnNoPrefix: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            grnreturnNo: ["",
                [
                    Validators.required,Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            issueToDeptPrefix: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            issueToDeptNo: ["",
                [
                    Validators.required,Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            returnFromDeptNoPrefix: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            returnFromDeptNo: ["",
                [
                    Validators.required,Validators.maxLength(30),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            isDeleted: ["true"],
            UpdatedBy: [""],
            AddedByName: [""],
            Header:[""],
            pharSalCountId:["",
                [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            pharSalRecCountId:["",
                [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            pharSalReturnCountId:["",
                [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],

            workOrderPrefix: 0,
            workOrderNo: 0,
            pharAdvId: 0,
            pharAdvReptId: 0,
            pharAdvRefId: 0,
            pharAdvRefReptId: 0,
            printStoreName: "String",
            dlNo: "String",
            gstin: "String",
            storeAddress: "String",
            hospitalMobileNo: 0,
            hospitalEmailId: "String",
            printStoreUnitName: "String",
            isPharStore: true,
            isWhatsAppMsg: true,
            whatsAppTemplateId: "String",
            isSmsmsg: true,
            smstemplateId: "String",
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

    // getValidationMessages() {
    //     return {
    //         storeName: [
    //             { name: "required", Message: "storeName  is required" },
    //             { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ],
    //         storeShortName: [
    //             { name: "required", Message: "storeShortName is required" },
    //             { name: "maxlength", Message: "storeShortName should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ],
    //         indentPrefix:[
    //             {name : "required", Message: "Indent Prefix is required"},
    //             { name: "maxlength", Message: "Indent Prefix should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ],
    //         indentNo:[
    //             {name : "required", Message: "Indent No is required"},
    //             { name: "maxlength", Message: "Indent No should not be greater than 30 char." },
    //             { name: "pattern", Message: "Only Numbers allowed." }
    //         ],
    //         grnreturnNoPrefix:[
    //             {name : "required", Message: "GRN Return No Prefix is required"},
    //             { name: "maxlength", Message: "GRN Return No Prefix should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ],
    //         grnreturnNo:[
    //             {name : "required", Message: "GRN Return No is required"},
    //             { name: "maxlength", Message: "GRN Return No should not be greater than 30 char." },
    //             { name: "pattern", Message: "Only Numbers allowed." }
    //         ],
    //         purchasePrefix:[
    //             {name : "required", Message: "Purchase Prefix is required"},
    //             { name: "maxlength", Message: "Purchase Prefix should not be greater than 50 char." },
    //             { name: "pattern", Message: "Only Characters allowed." }
    //         ],
    //         purchaseNo:[
    //             {name : "required", Message: "Purchase No is required"},
    //             { name: "maxlength", Message: "Purchase No should not be greater than 30 char." },
    //             { name: "pattern", Message: "Only Numbers allowed." }
    //         ],
    //         issueToDeptPrefix:[
    //             {name : "required", Message: "Issue to Dept Prefix is required"},
    //             { name: "maxlength", Message: "Indent Prefix should not be greater than 50 char." },
    //             { name: "pattern", Message: "Only Characters allowed." }
    //         ],
    //         issueToDeptNo:[
    //             {name : "required", Message: "Issue to Dept No is required"},
    //             { name: "maxlength", Message: "Issue to Dept No should not be greater than 30 char." },
    //             { name: "pattern", Message: "Only Numbers allowed." }
    //         ],
    //         grnPrefix:[
    //             {name : "required", Message: "GRN Prefix is required"},
    //             { name: "maxlength", Message: "GRN Prefix should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ],
    //         grnNo:[
    //             {name : "required", Message: "GRN No is required"},
    //             { name: "maxlength", Message: "GRN No should not be greater than 30 char." },
    //             { name: "pattern", Message: "Only Numbers allowed."}
    //         ],
    //         returnFromDeptNoPrefix:[
    //             {name : "required", Message: "Return From Dept No Prefix is required"},
    //             { name: "maxlength", Message: "Return From Dept No Prefix should not be greater than 50 char." },
    //             { name: "pattern", Message: "Special char not allowed." }
    //         ],
    //         returnFromDeptNo:[
    //             {name : "required", Message: "Return From Dept No is required"},
    //             { name: "maxlength", Message: "Return From Dept No should not be greater than 30 char." },
    //             { name: "pattern", Message: "Only Numbers allowed."}
    //         ],
    //         pharSalCountId:[
    //             {name : "required", Message: "Phar Sales Cash Counter is required"}
    //         ],
    //         pharSalRecCountId:[
    //             {name : "required", Message: "Phar Sales Rec Cash Counter is required"}
    //         ],
    //         pharSalReturnCountId:[
    //             {name : "required", Message: "Phar Sales Return Cash Counter is required"}
    //         ],

    //     };
    // }

    public storeMasterSave(Param: any, showLoader = true) {
        debugger
        if (Param.storeId) {
            return this._httpClient.PutData("StoreMaster/" + Param.storeId, Param, showLoader);
        } else return this._httpClient.PostData("StoreMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Store?Id=" + m_data.toString());
    }
}