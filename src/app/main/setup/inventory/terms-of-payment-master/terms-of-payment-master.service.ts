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
            termsOfPayment: ["",
                [
                    Validators.required, Validators.maxLength(50), 
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            isActive:[true,[Validators.required]]
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

    public termofpayMasterSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("TermsOfPayment/" + Param.id, Param);
        } else return this._httpClient.PostData("TermsOfPayment", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TermsOfPayment?Id=" + m_data.toString());
    }

}