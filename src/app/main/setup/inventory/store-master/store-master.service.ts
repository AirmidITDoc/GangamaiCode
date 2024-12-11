import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
            storeId: [""],
            storeShortName: ["",
                [
                    // Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            storeName: ["",
                [
                    // Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            indentPrefix: [""],
            indentNo: [""],
            purchasePrefix: [""],  
            purchaseNo: [""],
            grnPrefix: [""],  
            grnNo: [""],
            grnreturnNoPrefix: [""],
            grnreturnNo: [""],
            issueToDeptPrefix: [""],
            issueToDeptNo: [""],
            returnFromDeptNoPrefix: [""],
            returnFromDeptNo: [""],
            isDeleted: ["true"],
            UpdatedBy: [""],
            AddedByName: [""],
            Header:[""],
            pharSalCountId:[""],
            pharSalRecCountId:[""],
            pharSalReturnCountId:[""],
            workOrderPrefix:[""],
            workOrderNo:[""],
            pharAdvId: [""],
            pharAdvReptId:[""],
            pharAdvRefId:[""],
            pharAdvRefReptId:[""],
            printStoreName:[""],
            dlNo:[""],
            gstin:[""],
            storeAddress:[""],
            hospitalMobileNo: [""],
            hospitalEmailId: [""],
            printStoreUnitName: [""],
            isPharStore: true,
            isWhatsAppMsg: true,
            whatsAppTemplateId:[""],
            isSmsmsg: true,
            smstemplateId:[""]

        });
    }
        /*
    {
  "storeId": 0,
  "storeShortName": "shilpa",
  "storeName": "medical",
  "indentPrefix": "abc",
  "indentNo": "123",
  "purchasePrefix": "xyz",
  "purchaseNo": "453",
  "grnPrefix": "sss",
  "grnNo": "5643",
  "grnreturnNoPrefix": "123",
  "grnreturnNo": "string",
  "issueToDeptPrefix": "string",
  "issueToDeptNo": "11",
  "returnFromDeptNoPrefix": "string",
  "returnFromDeptNo": "string",
  "workOrderPrefix": "string",
  "workOrderNo": "string",
  "pharSalCountId": 0,
  "pharSalRecCountId": 0,
  "pharSalReturnCountId": 0,
  "pharAdvId": 0,
  "pharAdvReptId": 0,
  "pharAdvRefId": 0,
  "pharAdvRefReptId": 0,
  "printStoreName": "string",
  "dlNo": "string",
  "gstin": "string",
  "storeAddress": "pune",
  "hospitalMobileNo": "9987654311",
  "hospitalEmailId": "shilpameshra@23gmail.com",
  "printStoreUnitName": "facewash",
  "isPharStore": true,
  "isWhatsAppMsg": true,
  "whatsAppTemplateId": "string",
  "isSmsmsg": true,
  "smstemplateId": "string"
} */

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createStoremasterForm();
    }

    getValidationMessages() {
        return {
            storeName: [
                { name: "required", Message: "storeName  is required" },
                { name: "maxlength", Message: "storeName  should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            storeShortName: [
                { name: "required", Message: "storeShortName  is required" },
                { name: "maxlength", Message: "storeShortName  should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            indentPrefix: [

            ],
            indentNo: [

            ],
            grnreturnNoPrefix: [

            ],
            grnreturnNo: [

            ],
            purchasePrefix: [

            ],
            purchaseNo: [

            ],
            issueToDeptPrefix: [

            ],
            issueToDeptNo: [

            ],
            grnPrefix :[

            ],
            grnNo :[

            ],
            returnFromDeptNoPrefix :[

            ],
            returnFromDeptNo: [

            ],
            pharSalCountId :[

            ],
            pharSalRecCountId :[

            ],
            pharSalReturnCountId :[

            ],
        };
    }

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