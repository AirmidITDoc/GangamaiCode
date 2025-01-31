import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class RoleTemplateService {
    getPermissionList(RoleId: any) {
        throw new Error('Method not implemented.');
    }
    savePermission(data: { RoleId: number; children?: import("../role-permission/role-permission.component").FileNode[]; title: string; url?: any; isView?: boolean; isAdd?: boolean; isEdit?: boolean; isDelete?: boolean; menuId?: number; id?: string; translate?: string; type?: string; icon?: string; }[]) {
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
            RoleId: [0],
            RoleName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }
    initializeFormGroup() {
        this.createRoleForm();
    }

    public classMasterSave(Param: any) {
        if (Param.RoleId) {
            return this._httpClient.PutData("ClassMaster/" + Param.RoleId, Param);
        } else return this._httpClient.PostData("ClassMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ClassMaster?Id=" + m_data.toString());
    }

    // get Perfix Master list
    // public getRoleMasterList(Param) {
    //     return this._httpClient.get("Role/get-roles?RoleName="+Param);
    // }
    // public getPermissionList(RoleId){
    //     return this._httpClient.get("Role/get-permissions?RoleId="+RoleId);
    // }
    // Insert Perfix Master
    // public insertRoleMaster(Param) {
    //     return this._httpClient.post("Role/save", Param);
    // }
    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data, {});
    // }
    // public savePermission(Param) {
    //     return this._httpClient.post("Role/save-permission", Param);
    // }
    // public getmenus(Param) {
    //     return this._httpClient.get("Login/get-menus?RoleId="+Param);
    // }
    // public getFavMenus(RoleId,UserId) {
    //     return this._httpClient.get("Favourite/get-favmenus?RoleId="+RoleId+"&UserId="+UserId);
    // }
    // public setFavMenus(data) {
    //     return this._httpClient.post("Favourite/save", data);
    // }
    // public getpermissionmenus(Param) {
    //     return this._httpClient.get("Login/get-permission-menu?RoleId="+Param);
    // }
    // populateForm(param) {
    //     this.myform.patchValue(param);
    // }
}
