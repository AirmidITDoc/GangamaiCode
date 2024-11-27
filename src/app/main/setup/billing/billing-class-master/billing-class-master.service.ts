import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class BillingClassMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createClassForm();
        this.myformSearch = this.createSearchForm();
    }

    createClassForm(): FormGroup {
        return this._formBuilder.group({
            classId: [""],
            className: [""],
            isDeleted: [""],
            // AddedBy: ["0"],
            // UpdatedBy: ["0"],
            // AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ClassNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createClassForm();
    }
    getValidationMessages() {
        return {
            className: [
                { name: "required", Message: "Class Name is required" },
                { name: "maxlength", Message: "Class name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public classMasterSave(Param: any, showLoader = true) {
        if (Param.classId) {
            return this._httpClient.PutData("ClassMaster/" + Param.classId, Param, showLoader);
        } else return this._httpClient.PostData("ClassMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ClassMaster?Id=" + m_data.toString());
    }
}
