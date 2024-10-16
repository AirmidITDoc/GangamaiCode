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
            CityId: [""],
            CityName: [""],
            StateId: [""],
            StateName: [""],
            CountryId: [""],
            CountryName: [""],
            IsDeleted: ["false"],
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

  
    public getCityMasterCombo() {
        return this._httpClient1.post(
            "Generic/GetByProc?procName=Retrieve_CityMasterForCombo",
            {}
        );
    }

    

    public getStateList(CityId) {
        return this._httpClient1.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",{"Id": CityId})
    }
    
    public getCityMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("CityMaster/List", param, showLoader);
    }
    public cityMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("City", Param, showLoader);
    }

    public cityMasterUpdate(id: number , Param: any, showLoader = true) {
        return this._httpClient.PostData("City", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("City", m_data);
    }


    populateForm(param) {
        this.myform.patchValue(param);
    }
}
