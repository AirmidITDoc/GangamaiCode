import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class DepartmentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createDepartmentForm();
        this.myformSearch = this.createSearchForm();
    }

    createDepartmentForm(): FormGroup {
        return this._formBuilder.group({
            departmentId: [0],
            departmentName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[true,[Validators.required]],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DepartmentNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createDepartmentForm();
    }

    public getdepartmentMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("DepartmentMaster/List", param, showLoader);
    }
    
    public departmentMasterSave(Param: any, showLoader = true) {
        if (Param.departmentId) {
            return this._httpClient.PutData("DepartmentMaster/" + Param.departmentId, Param, showLoader);
        } else return this._httpClient.PostData("DepartmentMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DepartmentMaster?Id=" + m_data.toString());
    }
}
