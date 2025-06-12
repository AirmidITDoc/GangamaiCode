import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class ModeOfPaymentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createModeofpaymentForm();
        this.myformSearch = this.createSearchForm();
    }

    createModeofpaymentForm(): FormGroup {
        return this._formBuilder.group({
            id: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            modeOfPayment: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            isDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
            isActive: [true, [Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ModeOfPaymentSearch: [""],
            IsDeletedSearch: [""],
        });
    }
    initializeFormGroup() {
        this.createModeofpaymentForm();
    }



    public modeofpayMasterSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("ModeOfPayment/" + Param.id, Param);
        } else return this._httpClient.PostData("ModeOfPayment", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ModeOfPayment?Id=" + m_data.toString());
    }
}