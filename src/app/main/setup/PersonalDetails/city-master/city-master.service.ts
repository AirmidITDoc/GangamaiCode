import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class CityMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createCityForm();
        this.myformSearch = this.createSearchForm();
    }

    createCityForm(): FormGroup {
        return this._formBuilder.group({
            cityId: [0],
            cityName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            stateId: ["", 
                Validators.required
            ],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CityNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createCityForm();
    }

   

    public cityMasterSave(Param: any, showLoader = true) {
        if (Param.cityId) {
            return this._httpClient.PutData("CityMaster/" + Param.cityId, Param, showLoader);
        } else return this._httpClient.PostData("CityMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CityMaster?Id=" + m_data.toString());
    }
}
