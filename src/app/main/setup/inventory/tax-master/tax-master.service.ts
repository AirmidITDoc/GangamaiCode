import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TaxMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createTaxMasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createTaxMasterForm(): FormGroup {
        return this._formBuilder.group({
            id: [0],
            taxNature: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ],
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TaxNatureSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createTaxMasterForm();
    }

    public taxMasterSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("TaxMaster/" + Param.id,Param);
        } else return this._httpClient.PostData("TaxMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        
        return this._httpClient.DeleteData("TaxMaster?Id=" + m_data.toString());
    }
}
