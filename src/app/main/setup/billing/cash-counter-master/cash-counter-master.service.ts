import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";

@Injectable({
    providedIn: "root",
})
export class CashCounterMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _loaderService:LoaderService
    ) {
        this.myform = this.createcashcounterForm();
        this.myformSearch = this.createSearchForm();
    }

    createcashcounterForm(): FormGroup {
        return this._formBuilder.group({
            CashCounterId: [""],
            CashCounterName: [""],
            Prefix: [""],
            BillNo: [""],
            IsDeleted: ["1"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CashCounterNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createcashcounterForm();
    }

    public getCashcounterMasterList(param, loader = true) {
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post(
            "Generic/GetByProc?procName=Rtrv_CashCounterNameList_by_Name",
            param
        );
    }

    public cashCounterMasterInsert(param, loader = true) {
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post("Billing/CashCounterSave", param);
    }

    public cashCounterMasterUpdate(param, loader = true) {
        if (loader) {
          this._loaderService.show();
      }
        return this._httpClient.post("Billing/CashCounterUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
