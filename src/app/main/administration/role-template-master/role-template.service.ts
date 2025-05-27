import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class RoleTemplateService {


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
        if (Param.roleId) {
            return this._httpClient.PutData("RoleMaster/" + Param.roleId, Param);
        }else return this._httpClient.PostData("RoleMaster", Param);
    }
    getPermissionList(roleId: any) {
        return this._httpClient.GetData("RoleMaster/get-permissions?RoleId="+roleId);
    }

    public deactivateTheStatus(m_data) {
        
        return this._httpClient.DeleteData("RoleMaster?Id=" + m_data.toString());
    }
    public savePermission(Param) {
        return this._httpClient.PostData("RoleMaster/save-permission", Param);
    }
    
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
