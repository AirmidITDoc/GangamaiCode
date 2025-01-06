import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class GenericmasterService {
    genericForm: UntypedFormGroup;
    myformSearch: UntypedFormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.genericForm = this.createGenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createGenericForm(): UntypedFormGroup {
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

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            GenericNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createGenericForm();
    }

    // public getgenericMasterList(param: gridRequest, showLoader = true) {
    //     return this._httpClient.PostData("generic/List", param, showLoader);
    // }

    public genericMasterInsert(Param: any, showLoader = true) {
        if (Param.GenericId) {
            return this._httpClient.PutData("GenericMaster/" + Param.GenericId, Param, showLoader);
        } else return this._httpClient.PostData("GenericMaster", Param, showLoader);
    }

    public genericMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("generic/" + id , Param, showLoader);
        return this._httpClient.PostData("generic", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("generic?Id=" + m_data.toString());
    }

    // populateForm(param) {
    //     this.genericForm.patchValue(param);
    // }
}
