import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class WardMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createWardForm();
        this.myformSearch = this.createSearchForm();
    }

    createWardForm(): FormGroup {
        return this._formBuilder.group({
            roomId: [""],
            roomName: [""],
            locationId: [""],
           // locationName: [""],
           classId: [""],
            //className: [""],
            roomType: ["1"],
            isAvailable: ["1"],
           // isDeleted: ["false"],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RoomNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createWardForm();
    }

    getValidationMessages() {
        return {
            roomName: [
                { name: "required", Message: "RoomName  is required" },
                { name: "maxlength", Message: "RoomName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public roomMasterSave(Param: any, showLoader = true) {
        if (Param.roomId) {
            return this._httpClient.PutData("WardMaster/" + Param.roomId, Param, showLoader);
        } else return this._httpClient.PostData("WardMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("WardMaster?Id=" + m_data.toString());
    }
}
