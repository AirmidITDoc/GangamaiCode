import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DosemasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createDoseForm();
        this.myformSearch = this.createSearchForm();
    }

    createDoseForm(): FormGroup {
        return this._formBuilder.group({
            DoseId: [""],
            DoseName: ["", Validators.required],
            DoseNameInEnglish: ["", Validators.required],

            DoseQtyPerDay: ["", Validators.required],

            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    getValidationMessages(){
        return{
            DoseName: [
                { name: "required", Message: "Dose Name is required" }
            ],
            DoseNameInEnglish: [
                { name: "required", Message: "DoseNameInEnglish is required" }
            ],
            DoseQtyPerDay: [
                { name: "required", Message: "DoseQtyPerDay is required" }
            ],
        }
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoseNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDoseForm();
    }

    public getDoseMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("DoseMaster/List", param, showLoader);
    }

    public doseMasterInsert(Param: any, showLoader = true) {
        if (Param.DoseId) {
            return this._httpClient.PutData("DoseMaster/" + Param.DoseId, Param, showLoader);
        } else return this._httpClient.PostData("DoseMaster", Param, showLoader);
    }

    public doseMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("DoseMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        //return this._httpClient.delete("Gender?Id=" + m_data, {});
        return this._httpClient.PostData("DoseMaster", m_data);
    }
    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
