import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class CityMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(   private _httpClient1: HttpClient,
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createCityForm();
        this.myformSearch = this.createSearchForm();
    }

    createCityForm(): FormGroup {
        return this._formBuilder.group({
            cityId: [""],
            cityName: [""],
            stateId: [""],
            // StateName: [""],
            // countryId: [""],
            // CountryName: [""],
             isActive: [""],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
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

  
   
    getValidationMessages() {
        return {
           cityName: [
                { name: "required", Message: "City Name is required" },
                { name: "maxlength", Message: "City name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
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
