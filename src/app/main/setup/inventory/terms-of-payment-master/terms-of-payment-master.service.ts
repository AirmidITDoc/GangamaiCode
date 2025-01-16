import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TermsOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createtermsofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createtermsofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            Id: [0],
            TermsOfPayment: ["",
                [
                    Validators.required, Validators.maxLength(50), 
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[false,[Validators.required]]
            // IsDeleted: false,
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TermsOfPaymentSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createtermsofpaymentForm();
    }

    public termofpayMasterSave(Param: any, showLoader = true) {
        if (Param.Id) {
            return this._httpClient.PutData("TermsOfPayment/" + Param.Id, Param, showLoader);
        } else return this._httpClient.PostData("TermsOfPayment", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TermsOfPayment?Id=" + m_data.toString());
    }

}