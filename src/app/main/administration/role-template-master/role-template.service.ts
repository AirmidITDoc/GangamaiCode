import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class RoleTemplateService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
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
            RoleId: [""],
            RoleName: [""]
        });
    }
    initializeFormGroup() {
        this.createRoleForm();
    }
    // get Perfix Master list
    public getRoleMasterList(Param) {
        return this._httpClient.get("Role/get-roles", Param);
    }
    // Insert Perfix Master
    public insertRoleMaster(Param) {
        return this._httpClient.post("Role/save", Param);
    }
    public deactivateTheStatus(m_data) {
        return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data, {});
    }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
