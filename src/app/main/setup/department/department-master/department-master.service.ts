import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class DepartmentMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createDepartmentForm();
        this.myformSearch = this.createSearchForm();
    }

    createDepartmentForm(): FormGroup {
        return this._formBuilder.group({
            departmentId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            departmentName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
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
            IsDeletedSearch: [""],
        });
    }
    initializeFormGroup() {
        this.createDepartmentForm();
    }

    public getdepartmentMasterList(param: gridRequest) {
        return this._httpClient.PostData("DepartmentMaster/List", param);
    }
    
    public departmentMasterSave(Param: any) {
        if (Param.departmentId) {
            return this._httpClient.PutData("DepartmentMaster/" + Param.departmentId, Param);
        } else return this._httpClient.PostData("DepartmentMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DepartmentMaster?Id=" + m_data.toString());
    }
}
