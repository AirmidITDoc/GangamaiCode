import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class AreaMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createAreaForm();
        this.myformSearch = this.createSearchForm();
    }

    createAreaForm(): FormGroup {
        return this._formBuilder.group({
            areaId: [0],
            areaName: ["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            cityId: ["",Validators.required],
            cityName: [""],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            AreaNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createAreaForm();
    }

    public AreaMasterSave(Param: any) {
        if (Param.areaId) {
            return this._httpClient.PutData("AreaMaster/" + Param.areaId, Param);
        } else return this._httpClient.PostData("AreaMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("AreaMaster?Id=" + m_data.toString());
    }
}
