import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DischargetypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createDischargetypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createDischargetypeForm(): FormGroup {
        return this._formBuilder.group({
            dischargeTypeId: [""],
            dischargeTypeName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            IsDeleted: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DischargeTypeNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDischargetypeForm();
    }

   

    populateForm(Param) {
        this.myform.patchValue(Param);
    }



    public getDischargeTypeMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("DischargeType/List", param, showLoader);
    }

    getValidationMessages() {
        return {
            dischargeTypeName: [
                { name: "required", Message: "DischargeType Name is required" },
                { name: "maxlength", Message: "DischargeType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public dischargeTypeMasterSave(Param: any, showLoader = true) {
        if (Param.dischargeTypeId) {
            return this._httpClient.PutData("DischargeType/" + Param.dischargeTypeId, Param, showLoader);
        } else return this._httpClient.PostData("DischargeType", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DischargeType?Id=" + m_data.toString());
    }
}
