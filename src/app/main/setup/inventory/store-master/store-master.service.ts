import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class StoreMasterService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createStoremasterForm();
    }

    createStoremasterForm(): FormGroup {
        return this._formBuilder.group({
            StoreId: [""],
            StoreShortName: [""],
            StoreName: [""],
            IndentPrefix: [""],
            IndentNo: [""],
            PurchasePrefix: [""], //[Validators.pattern("[a-zA-Z]+$")]],
            PurchaseNo: [""],
            GrnPrefix: [""], //[Validators.pattern("[a-zA-Z]+$")]],
            GrnNo: [""],
            GrnreturnNoPrefix: [""],
            GrnreturnNo: [""],
            IssueToDeptPrefix: [""],
            IssueToDeptNo: [""],
            ReturnFromDeptNoPrefix: [""],
            ReturnFromDeptNo: [""],
            IsDeleted: [""],
            UpdatedBy: [""],
            AddedByName: [""],
            action: [""],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createStoremasterForm();
    }

    public getStoreMasterList(m_data) {
        //return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_Inventory_StoreMaster_by_Name", {StoreName:"%"})
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Rtrv_Inventory_StoreMaster_by_Name",
            m_data
        );
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,
            {}
        );
    }

    public insertStoreMaster(param) {
        return this._httpClient.post("/api/Inventory/StoreSave", param);
    }

    public updateStoreMaster(param) {
        return this._httpClient.post("/api/Inventory/StoreUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
