import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class TestmasterService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
    }

    createPathtestForm(): FormGroup {
        return this._formBuilder.group({
           
            TestId: [""],
            TestName: [""],
            PrintTestName: [""],
            CategoryId: [""],
            CategoryName: [""],
            TechniqueName: [""],
            MachineName: [""],
            SuggestionNote: [""],
            FootNote: [""],
            ServiceID: [""],
            ServiceName: [""],
            IsTemplateTest: ["0"],
            IsCategoryPrint: [""],
            IsPrintTestName: [""],
            ParameterId: [""],
            ParaId: [""],
            ParameterName: [""],
            IsDeleted: [""],
            UpdatedBy: [""],
            AddedBy: [""],
            action: [""],
            parametertxt: [""],
            PTemplateId: [""], 
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TestNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsSubTest:[" "],
        });
    }

    initializeFormGroup() {
        this.createPathtestForm();
    }

    // get Test Master list
    public getTestMasterList(param) {
        return this._httpClient.post( "Generic/GetByProc?procName=Retrieve_PathologyTestList",
            param
        );
    }
      // get sub Test Master list
      public getSubTestMasterList(param) {
        return this._httpClient.post( "Generic/GetByProc?procName=Retrieve_PathologySubTestList",
            param
        );
    }

    // Deactive the status
    public deactivateTheStatus(param) {
        return this._httpClient.post(
            "Generic/ExecByQueryStatement?query=" + param,
            {}
        );
    }

    // Cateogry Master Combobox List
    public getCategoryMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_PathCategoryMasterForCombo",
            {}
        );
    }

    // Template Master Combobox List
    public getTemplateMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_PathTemplateMasterForCombo",
            {}
        );
    }

    // Service Master Combobox List
    public getServiceMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_PathTestListForCombo",
            {}
        );
    }

    // Template Master Combobox List
    public getParameterMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=ps_Cmb_ParameterListForCombo",
            {}
        );
    }

    // Insert Perfix Master
    public insertPathologyTestMaster(param) {
        return this._httpClient.post(
            "PathologyMaster/PathologyTestMasterSave",
            param
        );
    }

    // Update Perfix Master
    public updatePathologyTestMaster(param) {
        return this._httpClient.post(
            "PathologyMaster/PathologyTestMasterUpdate",
            param
        );
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
}
