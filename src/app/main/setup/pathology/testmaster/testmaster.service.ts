import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators, Form } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";
import { ApiCaller } from "app/core/services/apiCaller";

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
    // mytemplateform: FormGroup;
    // testdetailsForm: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _loaderService: LoaderService,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
        // this.AddParameterFrom = this.createAddparaFrom();
        // this.mytemplateform = this.createTemplateForm();
        // this.templatedetailsForm = this.templatedetailsForm();
        // this.testdetailsForm = this.testdetailsForm();
    }

    createPathtestForm(): FormGroup {
        return this._formBuilder.group({
            // TestId: [0],
            // TestName: ["",
            //     [
            //         // Validators.required,
            //         // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //     ]
            // ],
            // PrintTestName: ["",
            //     [
            //         // Validators.required,
            //         // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //     ]
            // ],
            // CategoryId: [""],
            // TechniqueName: ["",
            //     [
            //         // Validators.required,
            //         // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //     ]
            // ],
            // MachineName: ["",
            //     [
            //         // Validators.required,
            //         // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //     ]
            // ],
            // SuggestionNote: ["", 
            //     // Validators.required
            // ],
            // FootNote: ["", 
            //     // Validators.required
            // ],
            // ServiceID: [""],
            // ServiceName: [""],
            // IsTemplateTest: ["0"],
            // IsCategoryPrint: [""],
            // IsPrintTestName: [""],
            // ParameterId: [""],
            // ParaId: [""],
            // ParameterName: [""],
            // IsDeleted: ["true"],
            // UpdatedBy: [""],
            // AddedBy: [""],
            // action: [""],
            // parametertxt: [""],
            // PTemplateId: [""],
            // IsSubTest: ["true"],
            // Status:[1],
            
            TestId: [0],
            TestName: [""],
            PrintTestName: [""],
            CategoryId: [""],
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
    /**
     * {
  "TestId": 0,
  "TestName": "LUCY",
  "PrintTestName": "STUFFY",
  "CategoryId": 12,
  "IsSubTest": true,
  "TechniqueName": "Api",
  "MachineName": "drill",
  "SuggestionNote": "XYZ",
  "FootNote": "ABC",
  "IsDeleted": true,
  "ServiceId": 15,
  "IsTemplateTest": true,
  "TestTime": "2022-09-10",
  "TestDate": "2022-07-11",
  "MPathTemplateDetails": [
    {
      "PtemplateId": 0,
      "TestId": 11,
      "TemplateId": 12
    }
  ],
  "MPathTestDetailMasters": [
    {
      "TestDetId": 0,
      "TestId": 16,
      "SubTestId": 17,
      "ParameterId": 19
    }
  ]
}
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
    // createAddparaFrom(): FormGroup {
    //     return this._formBuilder.group({
    //         ParameterName: [""],
    //         NewIsSubTest: [" "],
    //     });
    // }
    // createTemplateForm(): FormGroup {
    //     return this._formBuilder.group({
    //         TemplateId:[""],
    //         TemplateName:[""],
    //     });
    // }
      
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
    // retrieve sub Test Master list  remain
    public getSubTestList(param) {
        return this._httpClient.PostData("Generic/GetByProc?procName=Retrive_PathSubTestFill",
            param
        );
    }
    
    // get parameter master list
    public getParameterMasterList(param) {
        return this._httpClient.PostData("ParameterMaster/MPathParameterList",param);
    }
    // retrive parameter master list

    // get subTest master list of checkbox
    public getIsSubTestList(param) {
        return this._httpClient.PostData("PathTestMaster/TestMasterList",param);
    }
    
    // get Test master list
    public getTestListfor(param) {
        return this._httpClient.PostData("PathTestMaster/TestMasterList",param);
    }

    // retrive subtest list
    public getSubTestListfor(param) {
        return this._httpClient.PostData("Pathology/PathSubtestFillList",param);
    }
    
    public getTemplateListfor(param) {
        return this._httpClient.PostData("ParameterMaster/MPathParameterList",param);
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
        debugger
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
            TechniqueName: [
                { name: "required", Message: "TechniqueName is required" },
                { name: "maxlength", Message: "TechniqueName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            MachineName:[
                { name: "required", Message: "MachineName is required" },
                { name: "maxlength", Message: "MachineName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
            // SuggestionNote:[
            //     { name: "required", Message: "Suggestion is required" },
            //     { name: "maxlength", Message: "Suggestion should not be greater than 50 char." },
            //     // { name: "pattern", Message: "Special char not allowed." }
            // ],
            // FootNote:[
            //     { name: "required", Message: "FootNote is required" },
            //     { name: "maxlength", Message: "FootNote should not be greater than 50 char." },
            //     // { name: "pattern", Message: "Special char not allowed." }
            // ]
        };
    }

    public unitMasterSave(Param: any) {
        // if (Param.TestId) {
        //     return this._httpClient.PutData("PathTestMaster/Insert" + Param.TestId, Param);
        // } else
         return this._httpClient.PostData("PathTestMaster/Insert", Param);
    }

    public unitMasterUpdate(Param: any) {
        debugger
        if (Param.TestId) {
         return this._httpClient.PutData("PathTestMaster/Edit/" + Param.TestId, Param);
        }
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("PathUnitMaster", m_data);
    }
}

