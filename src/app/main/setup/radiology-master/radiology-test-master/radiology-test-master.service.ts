import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class RadiologyTestMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createRadiologytestForm();
        this.myformSearch = this.createSearchForm();
    }

    createRadiologytestForm(): FormGroup {
        return this._formBuilder.group({
            TestId: [""],
            TestName: [""],
            PrintTestName: [""],
            CategoryId: [""],
            CategoryName: [""],
            ServiceId: [""],
            ServiceID: [""],
            IsDeleted: ["false"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }
    createSearchForm(): FormGroup {
      return this._formBuilder.group({
        TestNameSearch: [""],
          IsDeletedSearch: ["2"],
      });
  }
    initializeFormGroup() {
        this.createRadiologytestForm();
    }

    public getRadiologytestMasterList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_RadiologyTestList",
            { ServiceName: "%" }
        );
    }

    // Category Master Combobox List
    public getCategoryMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_Radiology_CategoryMasterListForCombo",
            {}
        );
    }

    public insertRadiologyTestMaster(param) {
        return this._httpClient.post(
            "Radiology/RadiologyTestMasterSave",
            param
        );
    }

    // Service Master Combobox List
    public getServiceMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Retrieve_ServiceMasterForCombo",
            {}
        );
    }

    public updateRadiologyTestMaster(param) {
        return this._httpClient.post(
            "Radiology/RadiologyTestMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
