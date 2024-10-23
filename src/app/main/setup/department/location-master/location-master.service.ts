import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class LocationMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createLocationForm();
        this.myformSearch = this.createSearchForm();
    }

    createLocationForm(): FormGroup {
        return this._formBuilder.group({
            LocationId: [""],
            LocationName: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            LocationNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createLocationForm();
    }

  
    public getBedMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("BedMaster/List", param, showLoader);
    }

    public BedMasterInsert(Param: any, showLoader = true) {
        return this._httpClient.PostData("Bed", Param, showLoader);
    }

    public BedMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("Bed", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Bed", m_data);
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
