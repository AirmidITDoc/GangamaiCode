import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class CityMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
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
            IsDeleted: [true],
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

    public getCityMasterList(param) {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_CityNameList_by_Name",
            param
        );
    }
    public getCityList() {
        return this._httpClient.post("Generic/GetByProc?procName=RetrieveCityMasterForCombo", {})
      }
      //StateName Combobox List
      public getStateList(CityId) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional", { "Id": CityId })
      }
    public getCityMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_CityMasterForCombo",
            {}
        );
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
      }
    // public getStateMasterCombo() {
    //     return this._httpClient.post(
    //         "Generic/GetByProc?procName=Retrieve_StateMaster ",
    //         {}
    //     );
    // }

    // public getStateList(CityId) {
    //     return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional",{"Id": CityId})
    // }
    

    public cityMasterInsert(param) {
        return this._httpClient.post("PersonalDetails/CitySave", param);
    }

    public cityMasterUpdate(param) {
        return this._httpClient.post("PersonalDetails/CityUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
