import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class CashCounterMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    
    ) {
        this.myform = this.createcashcounterForm();
        this.myformSearch = this.createSearchForm();
    }

    createcashcounterForm(): FormGroup {
        return this._formBuilder.group({
            cashCounterId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z0-9]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            prefix: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z0-9]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            billNo: ["", 
                [
                    Validators.required, 
                  //  Validators.pattern("^[0-9]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
    
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CashCounterNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createcashcounterForm();
    }

    public cashcounterMasterSave(Param: any) {
        if (Param.cashCounterId) {
            return this._httpClient.PutData("CashCounter/" + Param.cashCounterId, Param);
        } else return this._httpClient.PostData("CashCounter", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CashCounter?Id=" + m_data.toString());
    }
    
}
