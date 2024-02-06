import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class TestmasterService {
    myformSearch: FormGroup;
    myform: FormGroup;
    AddParameterFrom: FormGroup;

    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
        this.AddParameterFrom = this.createAddparaFrom();
    }

    createPathtestForm(): FormGroup {
        return this._formBuilder.group({

            TestId: [""],
            TestName: [""],
            PrintTestName: [""],
            CategoryId: [""],
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
            IsDeleted: ["true"],
            UpdatedBy: [""],
            AddedBy: [""],
            action: [""],
            parametertxt: [""],
            PTemplateId: [""],
            IsSubTest: ["true"],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TestNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsSubTest: [" "],
        });
    }
    createAddparaFrom(): FormGroup {
        return this._formBuilder.group({
            ParameterName: [""],
            NewIsSubTest: [" "],
        });
    }

    initializeFormGroup() {
        this.createPathtestForm();
    }

    // get Test Master list
    public getTestMasterList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologyTestList",
            param
        );
    }
    // get sub Test Master list
    public getSubTestMasterList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathologySubTestList",
            param
        );
    }
    // retrieve sub Test Master list
    public getSubTestList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrive_PathSubTestFill",
            param
        );
    }
    // retrieve parameter Test Master list
    public getParameterTestList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=Retrive_PathparameterFill",
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
    // new Subtest list  Master Combobox List
    public getNewSubTestList() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=Retrieve_PathSubTestListForCombo",
            {}
        );
    }
    // Parameter Master Combobox List
    public getParameterMasterCombo() {
        return this._httpClient.post(//Retrieve_PathParameterListForCombo
            "Generic/GetByProc?procName=Rtrv_PathParameterList_by_Name",
            {}
        );
    }
    // get new sub Test Master list
    public getNewSubTestMasterList() {
        return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PathSubTestListForCombo",
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
