import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class LocationMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createLocationForm();
        this.myformSearch = this.createSearchForm();
    }

    createLocationForm(): FormGroup {
        return this._formBuilder.group({
            locationId: [0],
            locationName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[false,[Validators.required]],
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

    public locationMasterSave(Param: any, showLoader = true) {
        if (Param.locationId) {
            return this._httpClient.PutData("LocationMaster/" + Param.locationId, Param, showLoader);
        } else return this._httpClient.PostData("LocationMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("LocationMaster?Id=" + m_data.toString());
    }
}
