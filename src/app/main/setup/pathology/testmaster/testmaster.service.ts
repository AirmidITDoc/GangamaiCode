import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable({
    providedIn: "root",
})
export class TestmasterService {
    is_Test = true;
    is_subtest = false;
    is_templatetest= false;
    myformSearch: FormGroup;
    myform: FormGroup;
    AddParameterFrom: FormGroup;
    mytemplateform: FormGroup;
    constructor(
        private _httpClient: HttpClient,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
        this.AddParameterFrom = this.createAddparaFrom();
        this.mytemplateform = this.createTemplateForm();
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
            Status:[1],
            ParameterNameSearch:[""]
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
    createTemplateForm(): FormGroup {
        return this._formBuilder.group({
          
            TemplateId:[""],
            TemplateName:[""],
          
        });
      }
      
    initializeFormGroup() {
        this.createPathtestForm();
    }

    // get Test Master list
    public getTestMasterList(param) {//Retrieve_PathologyTestList
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathologyTestList",
            param
        );
    }
    // get sub Test Master list
    public getSubTestMasterList(param) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathologySubTestList",
            param
        );
    }
    // retrieve sub Test Master list  remain
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
            "Generic/GetByProc?procName=m_Rtrv_PathCategoryMasterForCombo",
            {}
        );
    }
    // new Subtest list  Master Combobox List
    public getNewSubTestList(emp) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_PathSubTestListForCombo",emp);
    }
    // Parameter Master Combobox List
    public getParameterMasterCombo() {
        return this._httpClient.post(//Retrieve_PathParameterListForCombo
            "Generic/GetByProc?procName=m_Rtrv_PathParameterList_by_Name",
            {}
        );
    }
    // get new sub Test Master list
    public getNewSubTestMasterList() {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathSubTestListForCombo",
            {}
        );
    }
    // Template Master Combobox List
    public getTemplateMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_PathTemplateMasterForCombo",
            {}
        );
    }

    // Service Master Combobox List
    public getServiceMasterCombo() {
        return this._httpClient.post(
            "Generic/GetByProc?procName=m_Rtrv_PathTestListForCombo",
            {}
        );
    }
    
    getTemplateCombo() {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PathTemplateMasterForComboMaster", {})
      }
      

    // Insert  Master
    public insertPathologyTestMaster(param) {
        return this._httpClient.post(
            "PathologyMaster/PathologyTestMasterSave",
            param
        );
    }

    // Update  Master
    public updatePathologyTestMaster(param) {
        return this._httpClient.post(
            "PathologyMaster/PathologyTestMasterUpdate",
            param
        );
    }

    getTestListfor(data) {
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathTestForUpdate",data)
      }

      getTemplateListfor(data) {
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PathTemplateForUpdate", data)
      }


    public getquerydata(data){
        return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
      }

descriptiveList = [];
numericList = [];

    populateForm(param) {
        debugger;
        this.myform.patchValue(param);
       
        this.numericList = param.TestList;
        this.descriptiveList = param.descriptiveList;
    }
}
