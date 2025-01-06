import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class RoleTemplateService {
    myform: UntypedFormGroup;
    myformSearch: UntypedFormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createRoleForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): UntypedFormGroup {
        return this._formBuilder.group({
            RoleNameSearch: [""]
        });
    }

    createRoleForm(): UntypedFormGroup {
        return this._formBuilder.group({
            RoleId: [""],
            RoleName: [""]
        });
    }
    initializeFormGroup() {
        this.createRoleForm();
    }
    // get Perfix Master list
    public getRoleMasterList(Param) {
        return this._httpClient.get("Role/get-roles?RoleName="+Param);
    }
    public getPermissionList(RoleId){
        return this._httpClient.get("Role/get-permissions?RoleId="+RoleId);
    }
    // Insert Perfix Master
    public insertRoleMaster(Param) {
        return this._httpClient.post("Role/save", Param);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data, {});
    }
    public savePermission(Param) {
        return this._httpClient.post("Role/save-permission", Param);
    }
    public getmenus(Param) {
        return this._httpClient.get("Login/get-menus?RoleId="+Param);
    }
    public getFavMenus(RoleId,UserId) {
        return this._httpClient.get("Favourite/get-favmenus?RoleId="+RoleId+"&UserId="+UserId);
    }
    public setFavMenus(data) {
        return this._httpClient.post("Favourite/save", data);
    }
    public getpermissionmenus(Param) {
        return this._httpClient.get("Login/get-permission-menu?RoleId="+Param);
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
