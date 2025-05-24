import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class CountryMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createCountryForm();
        this.myformSearch = this.createSearchForm();
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CountryNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }
    createCountryForm(): FormGroup {
        return this._formBuilder.group({
            countryId: [0],
            countryName: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }

    initializeFormGroup() {
        this.createCountryForm();
    }

   

    public countryMasterSave(Param: any) {
        if (Param.countryId) {
            return this._httpClient.PutData("CountryMaster/" + Param.countryId, Param);
        } else return this._httpClient.PostData("CountryMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CountryMaster?Id=" + m_data.toString());
    }
}
