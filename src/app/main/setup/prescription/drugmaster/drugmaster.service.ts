import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DrugmasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDrugForm();
        this.myformSearch = this.createSearchForm();
    }

    createDrugForm(): FormGroup {
        return this._formBuilder.group({
            DrugId: [""],
            DrugName: ["", Validators.required, Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            GenericId: [""],
            GenericName: ["", Validators.required],
            ClassId: [""],
            ClassName: ["", Validators.required],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    getValidationMessages(){
        return{
            DrugName: [
                { name: "required", Message: "Drug Name is required" }
            ]
        }
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DrugNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDrugForm();
    } 

    public getdrugMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("DrugMaster/List", param, showLoader);
    }

    public drugMasterInsert(Param: any, showLoader = true) {
        if (Param.DrugId) {
            return this._httpClient.PutData("DrugMaster/" + Param.DrugId, Param, showLoader);
        } else return this._httpClient.PostData("DrugMaster", Param, showLoader);
    }

    public drugMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("Drug", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("Drug", m_data);
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
