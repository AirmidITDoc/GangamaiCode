import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class BankMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createBankForm();
        this.myformSearch = this.createSearchForm();
    }

    createBankForm(): FormGroup {
        return this._formBuilder.group({
            bankId: [""],
            bankName: ["", Validators.required, Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            isActive: ["true"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BankNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createBankForm();
    }

    getValidationMessages(){
        return{
            bankName: [
                { name: "required", Message: "Bank Name is required" },
                { name: "maxlength", Message: "Bank name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
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


    populateForm(param) {
        this.myform.patchValue(param);
    }
}
