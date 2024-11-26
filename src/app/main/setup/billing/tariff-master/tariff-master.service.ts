import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TariffMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createTariffForm();
        this.myformSearch = this.createSearchForm();
    }

    createTariffForm(): FormGroup {
        return this._formBuilder.group({
            tariffId: [""],
            tariffName: [""],
            isDeleted: ["false"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TariffNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createTariffForm();
    }
    getValidationMessages(){
        return{
            tariffName: [
                { name: "required", Message: "Class Name is required" },
                { name: "maxlength", Message: "Class name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

    public getTariffMasterList(param: gridRequest, showLoader=true) {
        return this._httpClient.PostData("TarrifMaster/List", param, showLoader);
    }

    // public tariffMasterInsert(param) {
    //     return this._httpClient.post("Billing/TeriffSave", param);
    // }

    // public tariffMasterUpdate(param) {
    //     return this._httpClient.post("Billing/TariffUpdate", param);
    // }

    // New code
    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("TarrifMaster?Id=" + m_data.toString());
    }
    // 

    populateForm(param) {
        this.myform.patchValue(param);
    }

    public tariffMasterSave(Param: any, showLoader = true) {
        if (Param.tariffId) {
            return this._httpClient.PutData("TarrifMaster/" + Param.tariffId, Param, showLoader);
        } else return this._httpClient.PostData("TarrifMaster", Param, showLoader);
    }
}
