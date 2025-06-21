import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

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
    insertTestFrom: FormGroup;
    // mytemplateform: FormGroup;
    // testdetailsForm: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _loaderService: LoaderService,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
        this.insertTestFrom = this.createPathtestInsertForm();
        // this.AddParameterFrom = this.createAddparaFrom();
        // this.mytemplateform = this.createTemplateForm();
        // this.templatedetailsForm = this.templatedetailsForm();
        // this.testdetailsForm = this.testdetailsForm();
    }

    createPathtestForm(): FormGroup {
        return this._formBuilder.group({
            TestId: [0],
            TestName: ["", [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            PrintTestName: ["", [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
            CategoryId: ["",[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsSubTest: true,
            TechniqueName: [""],
            MachineName: [""],
            SuggestionNote: [""],
            FootNote: [""],
            IsDeleted: true,
            ServiceId: [""],
            IsTemplateTest: true,
            TestTime: ["2022-09-10"],
            TestDate: ["2022-07-11"],
            ParameterNameSearch:[""],
            isActive:[true,[Validators.required]],
            Status:[1],
        });
    }

     createPathtestInsertForm(): FormGroup {
        return this._formBuilder.group({
            pathTest:"",
            pathTemplateDetail:"",
            pathTestDetail:"",
        });
    }
    /**
     * 
     * 
     */
    templatedetailsForm(): FormGroup{
        return this._formBuilder.group({
            PtemplateId: [0],
            TestId: [""],
            TemplateId: [""],
            TemplateName:[""],
        });
    }
    testdetailsForm(): FormGroup{
        return this._formBuilder.group({
            TestDetId: [0],
            TestId: [""],
            SubTestId: [""],
            ParameterId: [""]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TestNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsSubTest: [" "],
        });
    }
      
    initializeFormGroup() {
        this.createPathtestForm();
    }
    public getTestMasterList(param,loader = true) {//Retrieve_PathologyTestList
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PathologyTestList",
            param
        );
    }
    // get sub Test Master list
    public getSubTestMasterList(param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PathologySubTestList",
            param
        );
    }

    // retrieve list  remain
    // get Test master list
    public getTestListfor(param) {
        return this._httpClient.PostData("PathTestMaster/PathTestForUpdateList",param);
    }
    public getSubTestList(param) { 
        return this._httpClient.PostData("PathTestMaster/PathTestForUpdateList",param);
    }
    public getTemplateListfor(param) {
        return this._httpClient.PostData("PathTestMaster/PathTemplateForUpdateList",param);
    }
    // retrieve list remain end       

    // retrive parameter master list

    // checkbox list
    // get subTest master list of checkbox
    public getIsSubTestList(param) {
        return this._httpClient.PostData("PathTestMaster/PathSubTestList",param);
    }
     // get parameter master list
     public getParameterMasterList(param) {
        return this._httpClient.PostData("ParameterMaster/MPathParameterList",param);
    }
    // checkbox end
    
    // retrive subtest list
    public getSubTestListfor(param) {
        return this._httpClient.PostData("Pathology/PathSubtestFillList",param);
    }
    
   

    public getParameterMasterCombo(emp,loader = true){
        if (loader) {
            this._loaderService.show();
        }
        return this._httpClient.PostData(//Retrieve_PathParameterListForCombo
            "Generic/GetByProc?procName=m_Rtrv_PathParameterList_by_Name1",emp);
    }

    public getNewSubTestList(emp) {
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Retrieve_PathSubTestListForCombo",emp);
    }

    public getNewSubTestMasterList() {
        return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_PathSubTestListForCombo",
            {}
        );
    }

    public getquerydata(data){
        
        return this._httpClient.PostData("Generic/GetBySelectQuery?query="+data, {})
    }


    getValidationMessages() {
        return {
            TestName: [
                { name: "required", Message: "TestName is required" },
                { name: "maxlength", Message: "TestName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            PrintTestName:[
                { name: "required", Message: "PrintTestName is required" },
                { name: "maxlength", Message: "PrintTestName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            CategoryId:[
                { name: "required", Message: "Category is required" },
            ],
            
        };
    }

    public TestMasterSave(Param: any) {
        debugger
        if (Param.pathTest.TestId) {
         return this._httpClient.PutData("PathTestMaster/Update/" + Param.pathTest.TestId, Param);
        }else return this._httpClient.PostData("PathTestMaster/Insert", Param);
    }

    public TestMasterUpdate(Param: any) {
        debugger
        if (Param.pathTest.testId) {
         return this._httpClient.PutData("PathTestMaster/Update/" + Param.pathTest.testId, Param);
        }
    }

    public deactivateTheStatus(Id:number) {
        return this._httpClient.DeleteData(`PathTestMaster/PathTestDelete?Id=${Id}`);
    }
}

