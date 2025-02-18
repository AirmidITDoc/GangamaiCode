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
            StoreId: [''],
            StoreShortName: [''],
            StoreName: [''],
            IndentPrefix: [''],
            IndentNo: [''],
            PurchasePrefix: [''],  
            PurchaseNo: [''],
            GrnPrefix: [''],  
            GrnNo: [''],
            GrnreturnNoPrefix: [''],
            GrnreturnNo: [''],
            IssueToDeptPrefix: [''],
            IssueToDeptNo: [''],
            ReturnFromDeptNoPrefix: [''],
            ReturnFromDeptNo: [''],
            IsDeleted: ["true"],
            UpdatedBy: [''],
            AddedByName: [''],
            Header:[''],
            PahsalesCashCounterID:[''],
            PahsalesrecCashCounterID:[''],
            PahsalesreturnCashCounterID:[''],
            PrintStoreName:[''],
            PrintTermsCondition:[''],
            PrintStoreAddress:[''],
            PahAdvCashCounterID:[''],
            PahAdvReceiCashCounterID:[''],
            PahAdvRefundCashCounterID:[''],
            PahAdvRefundReceiCashCounterID:[''],
            MobileNo:['']
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
            "Generic/GetByProc?procName=Rtrv_StoreMaster_by_Name",
            m_data
        );
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + m_data,{}
        );
    }

    public insertStoreMaster(param) {
        return this._httpClient.post("Inventory/StoreMasterSave", param);
    }

    public updateStoreMaster(param) {
        return this._httpClient.post("Inventory/StoreMasterUpdate", param);
    }

      // Get CashCounter List 
  public getCashcounterList() {
    return this._httpClient.post("Generic/GetByProc?procName=m_RtrvCashCounterForCombo", {})
  }
    populateForm(param) {
        this.myform.patchValue(param);
    }
}
