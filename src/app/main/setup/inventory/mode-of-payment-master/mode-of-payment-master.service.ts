import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ModeOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createModeofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createModeofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            id: [0],
            modeOfPayment: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
            isActive:[true,[Validators.required]]
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

    

    public modeofpayMasterSave(Param: any, showLoader = true) {
        if (Param.id) {
            return this._httpClient.PutData("ModeOfPayment/" + Param.id, Param, showLoader);
        } else return this._httpClient.PostData("ModeOfPayment", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ModeOfPayment?Id=" + m_data.toString());
    }
}