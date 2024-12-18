
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ModeOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createModeofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createModeofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            id: [""],
            modeOfPayment: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ModeOfPaymentSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createModeofpaymentForm();
    }

    getValidationMessages() {
        return {
            modeOfPayment: [
                { name: "required", Message: "modeOfPayment Name is required" },
                { name: "maxlength", Message: "modeOfPayment name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public modeofpayMasterSave(Param: any, showLoader = true) {
        if (Param.id) {
            return this._httpClient.PutData("ModeOfPayment/" + Param.id, Param, showLoader);
        } else return this._httpClient.PostData("ModeOfPayment", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ModeOfPayment?Id=" + m_data.toString());
    }
}