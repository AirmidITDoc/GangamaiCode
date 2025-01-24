import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class GenericmasterService {
    genericForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.genericForm = this.createGenericForm();
        this.myformSearch = this.createSearchForm();
    }

    createGenericForm(): FormGroup {
        return this._formBuilder.group({
            genericId: [0],
            genericName: ["", 
                [
                    Validators.required,Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ] 
            ],
            isActive:[true,[Validators.required]]
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
        if (Param.genericId) {
            return this._httpClient.PutData("GenericMaster/" + Param.genericId, Param, showLoader);
        } else return this._httpClient.PostData("GenericMaster", Param, showLoader);
    }

    // public genericMasterUpdate(id: number , Param: any, showLoader = true) {
    //     return this._httpClient.PostData("generic", Param, showLoader);
    // }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("GenericMaster?Id=" + m_data.toString());
    }

}
