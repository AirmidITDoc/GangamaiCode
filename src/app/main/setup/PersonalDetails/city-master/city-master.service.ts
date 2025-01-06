import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class CityMasterService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;
    constructor(   private _httpClient1: HttpClient,
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createCityForm();
        this.myformSearch = this.createSearchForm();
    }

    createCityForm(): UntypedFormGroup {
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
        });
    }
    createSearchForm(): UntypedFormGroup {
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
