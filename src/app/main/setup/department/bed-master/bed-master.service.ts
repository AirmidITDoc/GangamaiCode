import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class BedMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createBedForm();
        this.myformSearch = this.createSearchForm();
    }

    createBedForm(): FormGroup {
        return this._formBuilder.group({
            bedId:[""],
            bedName: [""],
            roomId: [""],
            //RoomName: [""],
            isAvailible: ["true"],
            // isActive: ["true"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BedNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createBedForm();
    }

    getValidationMessages() {
        return {
            bedName: [
                { name: "required", Message: "Bed Name is required" },
                { name: "maxlength", Message: "Bed name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public bedMasterSave(Param: any, showLoader = true) {
        if (Param.bedId) {
            return this._httpClient.PutData("BedMaster" + Param.bedId, Param, showLoader);
        } else return this._httpClient.PostData("BedMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("BedMaster", m_data);
    }
}
