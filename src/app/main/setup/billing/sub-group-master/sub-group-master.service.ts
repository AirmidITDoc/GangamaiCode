import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class SubGroupMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createSubgroupForm();
        this.myformSearch = this.createSearchForm();
    }

    createSubgroupForm(): FormGroup {
        return this._formBuilder.group({
            SubGroupId: [""],
            SubGroupName: [""],
            GroupId: [""],
            GroupName: [""],
            IsDeleted: ["false"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            SubGroupNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createSubgroupForm();
    }

    public getSubgroupMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_SubGroupMaster_by_Name",
            { SubGroupName: "%" }
        );
    }

    // Group Master Combobox List
    public getGroupMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_GroupListForCombo",
            {}
        );
    }

    public subGroupMasterInsert(param) {
        return this._httpClient.post("Billing/SubGroupSave", param);
    }

    public subGroupMasterUpdate(param) {
        return this._httpClient.post("Billing/SubGroupUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
