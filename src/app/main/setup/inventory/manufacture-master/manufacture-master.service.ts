import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ManufactureMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createManufactureForm();
        this.myformSearch = this.createSearchForm();
    }

    createManufactureForm(): FormGroup {
        return this._formBuilder.group({
            itemManufactureId: [""],
            manufactureName: [""],
            manufShortName: [""],
            isDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ManufNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createManufactureForm();
    }

   
    getValidationMessages() {
        return {
            manufactureName: [
                { name: "required", Message: "Currency Name is required" },
                { name: "maxlength", Message: "Currency name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public manufactureMasterSave(Param: any, showLoader = true) {
        if (Param.itemManufactureId) {
            return this._httpClient.PutData("ItemManufactureMaster/" + Param.itemManufactureId, Param, showLoader);
        } else return this._httpClient.PostData("ItemManufactureMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("ItemManufactureMaster", m_data);
    }
}
