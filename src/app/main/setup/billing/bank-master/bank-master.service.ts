
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class BankMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createBankForm();
        this.myformSearch = this.createSearchForm();
    }

    createBankForm(): UntypedFormGroup {
        return this._formBuilder.group({
            bankId: [0],
            bankName: ["", 
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: ["true"],
        });
    }
    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            BankNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createBankForm();
    }

    
   
    public getbankMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("BankMaster/List", param, showLoader);
    }

    // public bankMasterSave(Param: any, id: string ,showLoader = true) {
    //     if(id)
    //         return this._httpClient.PutData("bank/"+ id, Param, showLoader);
    //     else
    //         return this._httpClient.PostData("bank", Param, showLoader);       
    // }

    public bankMasterSave(Param: any, showLoader = true) {
        if (Param.bankId) {
            return this._httpClient.PutData("BankMaster/" + Param.bankId, Param, showLoader);
        } else return this._httpClient.PostData("BankMaster", Param, showLoader);
    }

 

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("BankMaster?Id=" + m_data.toString());
    }

}
