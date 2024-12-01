import { HttpClient } from "@angular/common/http";
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
            GenericId: [""],
            GenericName: ["", Validators.required],
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

    getValidationMessages(){
        return{
            GenericName: [
                { name: "required", Message: "Generic Name is required" },
                { name: "maxlength", Message: "Generic Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }
  

    public getgenericMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("generic/List", param, showLoader);
    }

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
        //return this._httpClient.delete("generic?Id=" + m_data, {});
        return this._httpClient.PostData("generic", m_data);
    }
    populateForm(param) {
        this.genericForm.patchValue(param);
    }
}
