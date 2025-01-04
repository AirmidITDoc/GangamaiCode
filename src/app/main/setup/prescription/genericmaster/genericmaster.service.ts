import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class GenericmasterService {
    genericForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.genericForm = this.createGenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createGenericForm(): FormGroup {
        return this._formBuilder.group({
            GenericId: [0],
            GenericName: ["", 
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            GenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createGenericForm();
    }

    public genericMasterInsert(Param: any, showLoader = true) {
        if (Param.GenericId) {
            return this._httpClient.PutData("GenericMaster/" + Param.GenericId, Param, showLoader);
        } else return this._httpClient.PostData("GenericMaster", Param, showLoader);
    }

    public genericMasterUpdate(id: number , Param: any, showLoader = true) {
        return this._httpClient.PostData("generic", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("generic?Id=" + m_data.toString());
    }

}
