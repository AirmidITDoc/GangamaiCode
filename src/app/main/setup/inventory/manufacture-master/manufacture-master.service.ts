import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ManufactureMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createManufactureForm();
        this.myformSearch = this.createSearchForm();
    }

    createManufactureForm(): FormGroup {
        return this._formBuilder.group({
            itemManufactureId: [0],
            manufactureName: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
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

    public manufactureMasterSave(Param: any, showLoader = true) {
        if (Param.itemManufactureId) {
            return this._httpClient.PutData("ItemManufactureMaster/" + Param.itemManufactureId, Param, showLoader);
        } else return this._httpClient.PostData("ItemManufactureMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemManufactureMaster?Id=" + m_data.toString());
    }
}
