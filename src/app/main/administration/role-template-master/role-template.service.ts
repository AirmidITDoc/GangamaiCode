import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class RoleTemplateService {

    getPermissionList(roleId: any) {
        throw new Error('Method not implemented.');
    }

    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createRoleForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RoleNameSearch: [""]
        });
    }

    createRoleForm(): FormGroup {
        return this._formBuilder.group({
            roleId: [0],
            roleName: ["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z0-9 @#&_-]+$"), // space,symbol,numbers
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }
    initializeFormGroup() {
        this.createRoleForm();
    }

    public roleMasterSave(Param: any) {
        return this._httpClient.PostData("RoleMaster", Param);
    }
    public roleMasterUpdate(Param: any) {
        debugger
        if (Param.roleId) {
            return this._httpClient.PutData("RoleMaster/" + Param.roleId, Param);
        }
    }

    public deactivateTheStatus(m_data) {
        debugger
        return this._httpClient.DeleteData("RoleMaster?Id=" + m_data.toString());
    }

    
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
