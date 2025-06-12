import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class TermsOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createtermsofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createtermsofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            Id: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            termsOfPayment: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isActive: [true, [Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TermsOfPaymentSearch: [""],
            IsDeletedSearch: [""],
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